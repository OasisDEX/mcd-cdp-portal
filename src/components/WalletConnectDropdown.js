import React, { useEffect, useState, useCallback } from 'react';
import lang from 'languages';
import { Card, Dropdown, Box, Text, Grid } from '@makerdao/ui-components-core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useNavigation } from 'react-navi';
import { mixpanelIdentify } from 'utils/analytics';
import { cutMiddle } from 'utils/ui';
import { getWebClientProviderName } from 'utils/web3';
import { getWalletConnectAccounts } from 'utils/walletconnect';
import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';
import useBrowserProvider from 'hooks/useBrowserProvider';
import { getMeasurement, getColor } from 'styles/theme';
import { Routes } from '../utils/constants';

const Option = ({ children, ...props }) => {
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
      <Text p="body">{children}</Text>
    </Box>
  );
};

const WalletConnectDropdown = ({
  trigger,
  children,
  close = () => {},
  ...props
}) => {
  const { maker, account, connectBrowserProvider } = useMaker();
  const { activeAccountAddress } = useBrowserProvider();
  const [otherAccounts, setOtherAccounts] = useState([]);
  const navigation = useNavigation();

  const onAccountChosen = useCallback(
    async ({ address }, type) => {
      maker.useAccountWithAddress(address);
      mixpanelIdentify(address, type);
      const { search } = (await navigation.getRoute()).url;
      navigation.navigate({
        pathname: `/${Routes.BORROW}/owner/${address}`,
        search
      });
    },
    [maker, navigation]
  );
  const { connectLedgerWallet } = useLedger({ onAccountChosen });
  const { connectTrezorWallet } = useTrezor({ onAccountChosen });

  useEffect(() => {
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

  async function connectBrowserWallet({ providerName }) {
    try {
      const connectedAddress = await connectBrowserProvider();
      onAccountChosen({ address: connectedAddress }, providerName);
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
            account.type === 'browser'
              ? getWebClientProviderName()
              : account.type;
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
                <Text t="body">{cutMiddle(account.address, 7, 5)}</Text>
              </Grid>
            </Option>
          );
        })}
        {!hasBrowserAccount && (
          <Option
            onClick={() => {
              connectBrowserWallet({
                providerName: getWebClientProviderName()
              });
              close();
            }}
          >
            Connect to {lang.providers[getWebClientProviderName()]}
          </Option>
        )}
        <Option
          onClick={() => {
            connectLedgerWallet();
            close();
          }}
        >
          Connect to Ledger Nano
        </Option>
        <Option
          onClick={() => {
            connectTrezorWallet();
            close();
          }}
        >
          Connect to Trezor
        </Option>
        <Option
          onClick={() => {
            getWalletConnectAccounts();
            close();
          }}
        >
          Wallet Connect
        </Option>
      </Card>
    </Dropdown>
  );
};

export default WalletConnectDropdown;
