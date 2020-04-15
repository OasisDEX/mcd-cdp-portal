import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import {
  Box,
  Dropdown,
  DefaultDropdown,
  Text,
  Flex
} from '@makerdao/ui-components-core';
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
import { BrowserView } from 'react-device-detect';

const DropdownWrapper = styled(Box)`
  :hover {
    ${FilledButton} {
      background-color: #50445e;
    }
  }
`;

const DropdownItems = styled(DefaultDropdown)`
  margin-bottom: 8px;
  min-width: 320px;
  background: #ffffff;
  border: 1px solid #ecf1f3;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px 7px 12px;
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

const IconButtonStyle = styled(Box)`
  width: 255px;
  padding: 12px 26px 12px;
  cursor: pointer;

  .text {
    margin-left: 23px;
  }

  :hover .text {
    opacity: 0.6;
  }
`;

const IconButton = ({ icon, iconSize = '26.67px', children, ...props }) => {
  return (
    <IconButtonStyle {...props}>
      <Flex alignItems="center" justifyContent="flex-start" height="32px">
        <IconBox size={iconSize}>{icon}</IconBox>
        <Text className="text">{children}</Text>
      </Flex>
    </IconButtonStyle>
  );
};

function BrowserProviderButton({ provider, ...props }) {
  const { lang } = useLanguage();
  const icon = useBrowserIcon(provider);
  return (
    <IconButton icon={icon} {...props}>
      {lang.providers[provider] || 'Active Wallet'}
    </IconButton>
  );
}

function AccountSelection({ buttonWidth, ...props }) {
  const [showMore, setShowMore] = useState(false);
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

  // wallet buttons
  const walletLink = (
    <IconButton
      onClick={() => connectToProviderOfType(AccountTypes.WALLETLINK)}
      disabled={!makerAuthenticated}
      icon={<WalletLinkLogo />}
    >
      {lang.landing_page.wallet_link}
    </IconButton>
  );

  const walletConnect = (
    <IconButton
      onClick={() => connectToProviderOfType(AccountTypes.WALLETCONNECT)}
      icon={<WalletConnectLogo style={{ width: '28px' }} />}
    >
      {lang.landing_page.wallet_connect}
    </IconButton>
  );

  const ledger = (
    <IconButton
      onClick={connectLedgerWallet}
      disabled={!makerAuthenticated}
      icon={<LedgerLogo />}
      iconSize="27px"
    >
      {lang.providers.ledger_nano}
    </IconButton>
  );

  const trezor = (
    <IconButton
      onClick={connectTrezorWallet}
      disabled={!makerAuthenticated}
      icon={<TrezorLogo />}
    >
      {lang.providers.trezor}
    </IconButton>
  );

  return (
    <Box width={buttonWidth} {...props}>
      <DropdownWrapper>
        <Dropdown
          hitBoxMargin="8px 0"
          placement="top"
          trigger={
            <FilledButton width={buttonWidth}>
              {lang.providers.connect_wallet}
              <CaratDown style={{ marginTop: '2px', marginLeft: '15px' }} />
            </FilledButton>
          }
        >
          {showMore ? (
            <DropdownItems>
              <Text onClick={() => setShowMore(false)}>
                {lang.providers.main_wallets}
              </Text>
              {walletLink}
              {walletConnect}
              {ledger}
              {trezor}
            </DropdownItems>
          ) : (
            <DropdownItems>
              <BrowserProviderButton
                onClick={connectBrowserWallet}
                disabled={!makerAuthenticated}
                provider={providerName}
              />
              <BrowserView>{walletLink}</BrowserView>
              <BrowserView>{walletConnect}</BrowserView>
              <BrowserView>{ledger}</BrowserView>
              <BrowserView>{trezor}</BrowserView>
              <BrowserView>
                <Text onClick={() => setShowMore(true)}>
                  {lang.providers.more_wallets}
                </Text>
              </BrowserView>
              {/* <ReadOnlyConnect /> */}
            </DropdownItems>
          )}
        </Dropdown>
      </DropdownWrapper>
    </Box>
  );
}

export default hot(AccountSelection);
