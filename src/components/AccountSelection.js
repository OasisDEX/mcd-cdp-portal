import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Box, Text, Flex } from '@makerdao/ui-components-core';
import lang from 'languages';
import { mixpanelIdentify } from 'utils/analytics';

import { FilledButton } from 'components/Marketing';

import { getWebClientProviderName } from 'utils/web3';
import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';
import useLanguage from 'hooks/useLanguage';
import useBrowserIcon from 'hooks/useBrowserIcon';

import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { ReactComponent as WalletConnectLogo } from 'images/wallet-connect.svg';
import { ReactComponent as WalletLinkLogo } from 'images/wallet-link.svg';
import { ReactComponent as CaratDown } from 'images/carat-down-filled.svg';
import { AccountTypes } from 'utils/constants';
import { BrowserView, isMobile } from 'react-device-detect';

const ConnectDropdownStyle = styled.div`
  .dropdown-trigger-wrapper {
    margin: -8px;
    padding: 8px;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.2s;
    pointer-events: none;
    opacity: 0;
    z-index: 200;
  }

  ${props => (props.openOnHover ? ':hover, :active' : '&.show')} {
    .dropdown-menu {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

const ConnectDropdown = ({ trigger, show, children, ...props }) => {
  return (
    <ConnectDropdownStyle className={show ? 'show' : ''} {...props}>
      <div className="dropdown-trigger-wrapper">{trigger}</div>
      <div className="dropdown-menu">{children}</div>
    </ConnectDropdownStyle>
  );
};

const DropdownItems = styled(Box)`
  margin-bottom: 8px;
  min-width: 270px;
  background: #ffffff;
  border: 1px solid #ecf1f3;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px 7px 12px;
  position: relative;

  & > * {
    margin-top: 8px;
    margin-bottom: 8px;
  }
`;

const DropdownWrapper = styled(Box)`
  ${props =>
    props.isMobile
      ? `
    ${FilledButton}, ${FilledButton}:hover {
       background-color: ${
         props.isOpen ? '#50445e' : props.theme.colors.darkPurple
       };
    }
  `
      : `
    :hover {
      ${FilledButton} {
        background-color: #50445e;
      }
    }
  `}

  ${DropdownItems} {
    &.smaller {
      position: absolute;
      top: 0;
    }
    &.show {
      opacity: 1;
      z-index: 1;
    }
    &.hide {
      opacity: 0;
      z-index: -1;
      pointer-events: none;
    }
  }
`;

const IconBox = styled(Box)`
  display: flex;
  align-items: center;
  &,
  svg,
  img {
    width: ${props => props.size};
    height: ${props => props.size};
  }
`;

const Item = styled(Box)`
  width: 255px;
  padding: 12px 26px;
  cursor: pointer;
`;

const IconItemStyle = styled(Item)`
  .text {
    margin-left: 23px;
  }

  :hover .text {
    opacity: 0.6;
  }
`;

const IconItem = ({ icon, iconSize = '26.67px', children, ...props }) => {
  return (
    <IconItemStyle {...props}>
      <Flex alignItems="center" justifyContent="flex-start" height="29px">
        <IconBox size={iconSize}>{icon}</IconBox>
        <Text className="text">{children}</Text>
      </Flex>
    </IconItemStyle>
  );
};

function BrowserProviderItem({ provider, ...props }) {
  const { lang } = useLanguage();
  const icon = useBrowserIcon(provider);
  return (
    <IconItem icon={icon} {...props}>
      {lang.providers[provider] || 'Active Wallet'}
    </IconItem>
  );
}

const NavItem = styled(Item)`
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.s};
  letter-spacing: 0.5px;
  color: #1aab9b;
  text-align: left;
  padding: 9px 26px;

  :hover {
    opacity: 0.6;
  }
`;

function AccountSelection({ buttonWidth = '213px', ...props }) {
  const dropdown = useRef(null);
  const [showMain, setShowMain] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // only for mobile

  useEffect(() => {
    function handleDocumentClick(e) {
      if (!dropdown.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  });

  const providerName = getWebClientProviderName();
  const {
    maker,
    authenticated: makerAuthenticated,
    connectBrowserProvider,
    connectToProviderOfType
  } = useMaker();

  const onAccountChosen = useCallback(
    async ({ address }, type) => {
      maker.useAccountWithAddress(address);
      mixpanelIdentify(address, type);
    },
    [maker]
  );
  const { connectTrezorWallet } = useTrezor({ onAccountChosen });
  const { connectLedgerWallet } = useLedger({ onAccountChosen });

  async function connectBrowserWallet() {
    try {
      const connectedAddress = await connectBrowserProvider();
      onAccountChosen({ address: connectedAddress }, providerName);
    } catch (err) {
      window.alert(err);
    }
  }

  // wallet items
  const walletLink = (
    <IconItem
      onClick={() => connectToProviderOfType(AccountTypes.WALLETLINK)}
      disabled={!makerAuthenticated}
      icon={<WalletLinkLogo />}
      key="wallet-link"
    >
      {lang.landing_page.wallet_link}
    </IconItem>
  );

  const walletConnect = (
    <IconItem
      onClick={() => connectToProviderOfType(AccountTypes.WALLETCONNECT)}
      icon={<WalletConnectLogo style={{ width: '28px' }} />}
      key="wallet-connect"
    >
      {lang.landing_page.wallet_connect}
    </IconItem>
  );

  const ledger = (
    <IconItem
      onClick={connectLedgerWallet}
      disabled={!makerAuthenticated}
      icon={<LedgerLogo />}
      iconSize="27px"
      key="ledger"
    >
      {lang.providers.ledger_nano}
    </IconItem>
  );

  const trezor = (
    <IconItem
      onClick={connectTrezorWallet}
      disabled={!makerAuthenticated}
      icon={<TrezorLogo />}
      key="trezor"
    >
      {lang.providers.trezor}
    </IconItem>
  );

  const mainWallets = [ledger, trezor];
  const otherWallets = [walletLink, walletConnect];

  const mainWalletsCount = mainWallets.length + 1; // Add the browser provider wallet

  return (
    <Box width={buttonWidth} {...props} ref={dropdown}>
      <DropdownWrapper isMobile={isMobile} isOpen={isOpen}>
        <ConnectDropdown
          openOnHover={!isMobile}
          show={isMobile ? isOpen : undefined}
          trigger={
            <FilledButton
              width={buttonWidth}
              height="44px"
              onClick={() => {
                setIsOpen(!isOpen); // only for mobile
              }}
            >
              {lang.providers.connect_wallet}
              <CaratDown
                style={{ marginTop: '2px', marginLeft: '19px', fill: 'white' }}
              />
            </FilledButton>
          }
        >
          <div>
            <DropdownItems
              className={`${
                mainWalletsCount >= otherWallets.length ? 'larger' : 'smaller'
              } ${showMain ? 'show' : 'hide'}`}
            >
              <BrowserProviderItem
                onClick={connectBrowserWallet}
                disabled={!makerAuthenticated}
                provider={providerName}
                key="browser-provider-wallet"
              />
              {mainWallets.map((wallet, index) => (
                <BrowserView key={index}>{wallet}</BrowserView>
              ))}
              <BrowserView key="see-more-wallets-link">
                <NavItem onClick={() => setShowMain(false)}>
                  {lang.providers.more_wallets}
                  {` (${otherWallets.length})`}
                </NavItem>
              </BrowserView>
            </DropdownItems>
            <BrowserView style={{ position: 'static' }}>
              <DropdownItems
                className={`${
                  otherWallets.length > mainWalletsCount ? 'larger' : 'smaller'
                } ${showMain ? 'hide' : 'show'}`}
              >
                <NavItem
                  key="see-main-wallets-link"
                  onClick={() => setShowMain(true)}
                >
                  {lang.providers.main_wallets}
                  {` (${mainWalletsCount})`}
                </NavItem>
                {otherWallets}
              </DropdownItems>
            </BrowserView>
          </div>
        </ConnectDropdown>
      </DropdownWrapper>
    </Box>
  );
}

export default hot(AccountSelection);
