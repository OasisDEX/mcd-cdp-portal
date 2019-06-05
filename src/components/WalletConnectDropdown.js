import React, { useEffect, useState } from 'react';
import lang from 'languages';
import { Card, Dropdown, Box, Text, Grid } from '@makerdao/ui-components-core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { mixpanelIdentify } from 'utils/analytics';
import { cutMiddle } from 'utils/ui';
import { getWebClientProviderName } from 'utils/web3';
import { getWalletConnectAccounts } from 'utils/walletconnect';
import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';
import theme, { getMeasurement, getSpace, getColor } from 'styles/theme';

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

const WalletConnectDropdown = ({ children, close, ...props }) => {
  const { maker, account, connectBrowserProvider } = useMaker();
  const { connectLedgerWallet } = useLedger({ onAccountChosen });
  const { connectTrezorWallet } = useTrezor({ onAccountChosen });
  const [otherAccounts, setOtherAccounts] = useState([]);

  function onAccountChosen({ address }, type) {
    maker.useAccountWithAddress(address);
    mixpanelIdentify(address, type);
  }

  useEffect(() => {
    const accounts = maker.listAccounts();
    const otherAccounts = accounts.filter(a => a.address !== account.address);
    setOtherAccounts(otherAccounts);
  }, [maker, account]);

  const hasBrowserAccount =
    account.type === 'browser' || otherAccounts.some(a => a.type === 'browser');

  return (
    <Dropdown
      trigger={children}
      offset={`-${theme.space.s + 1}, 5px`}
      {...props}
    >
      <Card
        width={getMeasurement('sidebarWidth') - getSpace('s')}
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
          <Option onClick={connectBrowserProvider}>
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
