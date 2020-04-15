import React, { useEffect, useState } from 'react';
import {
  Card,
  Dropdown,
  Box,
  Text,
  Grid,
  Flex
} from '@makerdao/ui-components-core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useCurrentRoute } from 'react-navi';
import styled, { css } from 'styled-components';

import { cutMiddle } from 'utils/ui';
import { getWebClientProviderName } from 'utils/web3';
import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';
import useBrowserIcon from 'hooks/useBrowserIcon';
import useBrowserProvider from 'hooks/useBrowserProvider';
import useLanguage from 'hooks/useLanguage';
import { getMeasurement, getColor } from 'styles/theme';
import { AccountTypes, Routes } from 'utils/constants';
import { BrowserView } from 'react-device-detect';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { ReactComponent as WalletLinkLogo } from 'images/wallet-link.svg';
import { ReactComponent as DisconnectIcon } from 'images/disconnect.svg';
import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as WalletConnectLogo } from 'images/wallet-connect.svg';

const negativeMarginY = css`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledLedgerLogo = styled(LedgerLogo)`
  max-width: 14px;
  position: relative;
  top: 4px;
`;

const StyledWalletLinkLogo = styled(WalletLinkLogo)`
  ${negativeMarginY};
  height: 21px;
  width: 21px;
`;

const StyledTrezorLogo = styled(TrezorLogo)`
  ${negativeMarginY};
`;

const StyledWalletConnectLogo = styled(WalletConnectLogo)`
  ${negativeMarginY};
`;

const IconBox = styled(Box)`
  & > svg {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
  width: 26px;
  text-align: center;
`;

const Option = ({ icon, children, ...props }) => {
  return (
    <Box
      py="xs"
      px="s"
      css={`
        cursor: pointer;
        &:hover {
          background-color: ${getColor('grey.100')};
        }
      `}
      {...props}
    >
      <Flex alignItems="center">
        <IconBox>{icon}</IconBox>
        <span style={{ marginLeft: '14px' }}>
          <Text p="body">{children}</Text>
        </span>
      </Flex>
    </Box>
  );
};

const WalletConnectDropdown = ({ trigger, close = () => {}, ...props }) => {
  const { lang } = useLanguage();
  const {
    maker,
    account,
    connectBrowserProvider,
    connectToProviderOfType,
    navigation,
    disconnect
  } = useMaker();
  const { connectLedgerWallet } = useLedger({ onAccountChosen });
  const { connectTrezorWallet } = useTrezor({ onAccountChosen });
  const { activeAccountAddress } = useBrowserProvider();
  const [otherAccounts, setOtherAccounts] = useState([]);
  const { url } = useCurrentRoute();

  const providerName = getWebClientProviderName();
  const browserIcon = useBrowserIcon(providerName);

  function onAccountChosen({ address }) {
    if (url.pathname.startsWith(`/${Routes.SAVE}/owner/`)) {
      const urlAddress = url.pathname.split('/')[url.pathname.length - 1];
      if (address !== urlAddress) {
        navigation.navigate(`/${Routes.SAVE}/owner/${address}${url.search}`);
      }
    }
    maker.useAccountWithAddress(address);
  }

  useEffect(() => {
    if (!account) return;
    const accounts = maker.listAccounts();
    const otherAccounts = accounts.filter(
      a =>
        a.address !== account.address &&
        (account.type !== 'browser' || a.type !== 'browser') &&
        (account.type === 'browser' || a.address === activeAccountAddress)
    );
    setOtherAccounts(otherAccounts);
  }, [maker, account, activeAccountAddress]);

  const hasBrowserAccount =
    account &&
    (account.type === 'browser' ||
      otherAccounts.some(a => a.type === 'browser'));

  async function connectBrowserWallet() {
    try {
      const connectedAddress = await connectBrowserProvider();
      onAccountChosen({ address: connectedAddress });
    } catch (err) {
      window.alert(err);
    }
  }

  return (
    <Dropdown trigger={trigger} display="block" {...props}>
      <Card
        width={getMeasurement('sidebarWidth')}
        css={`
          border-top-right-radius: 0;
          border-top-left-radius: 0;
        `}
      >
        {otherAccounts.map(account => {
          const providerType =
            account.type === 'browser' ? providerName : account.type;
          return (
            <Option
              key={account.address}
              onClick={() => {
                onAccountChosen(account, account.type);
                close();
              }}
            >
              <Grid
                justifyContent="start"
                alignItems="center"
                gridColumnGap="xs"
                gridTemplateColumns="auto auto auto"
                fontWeight="semibold"
              >
                <Jazzicon
                  diameter={22}
                  seed={jsNumberForAddress(account.address)}
                />
                <Text t="body">{lang.providers[providerType]}</Text>
                <Text t="body" fontSize="l">
                  {cutMiddle(account.address, 7, 5)}
                </Text>
              </Grid>
            </Option>
          );
        })}
        {!hasBrowserAccount && (
          <Option
            onClick={() => {
              connectBrowserWallet();
              close();
            }}
            icon={browserIcon}
          >
            {lang.formatString(
              lang.connect_to,
              providerName !== '' ? lang.providers[providerName] : providerName
            )}
          </Option>
        )}
        <BrowserView>
          <Option
            onClick={() => {
              connectLedgerWallet();
              close();
            }}
            icon={<StyledLedgerLogo />}
          >
            {lang.formatString(lang.connect_to, 'Ledger Nano')}
          </Option>
        </BrowserView>
        <BrowserView>
          <Option
            onClick={() => {
              connectTrezorWallet();
              close();
            }}
            icon={<StyledTrezorLogo />}
          >
            {lang.formatString(lang.connect_to, 'Trezor')}
          </Option>
        </BrowserView>
        <BrowserView>
          <Option
            onClick={() => {
              connectToProviderOfType(AccountTypes.WALLETCONNECT);
              close();
            }}
            icon={<StyledWalletConnectLogo style={{ width: '26.67px' }} />}
          >
            {lang.landing_page.wallet_connect}
          </Option>
        </BrowserView>
        <BrowserView>
          <Option
            onClick={() => {
              connectToProviderOfType(AccountTypes.WALLETLINK);
              close();
            }}
            icon={<StyledWalletLinkLogo />}
          >
            {lang.landing_page.wallet_link}
          </Option>
        </BrowserView>
        {account && (
          <BrowserView>
            <Option
              onClick={() => {
                disconnect();
                close();
              }}
              icon={<DisconnectIcon />}
            >
              {lang.disconnect}
            </Option>
          </BrowserView>
        )}
      </Card>
    </Dropdown>
  );
};

export default WalletConnectDropdown;
