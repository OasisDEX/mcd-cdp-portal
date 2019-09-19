import React, { useCallback } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Text, Grid, Flex } from '@makerdao/ui-components-core';
import lang from 'languages';
import { mixpanelIdentify } from 'utils/analytics';

import PageContentLayout from 'layouts/PageContentLayout';

import BrowserProviderButton from 'components/BrowserProviderButton';
import IconButton from 'components/IconButton';
import { getWebClientProviderName } from 'utils/web3';
import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';
import { getWalletConnectAccounts } from 'utils/walletconnect';

import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { ReactComponent as WalletConnectLogo } from 'images/wallet-connect.svg';
import { ReactComponent as WalletLinkLogo } from 'images/wallet-link.svg';
import { AccountTypes } from '../utils/constants';

const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledTrezorLogo = styled(TrezorLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledWalletConnectLogo = styled(WalletConnectLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledWalletLinkLogo = styled(WalletLinkLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
  height: 21px;
  width: 21px;
`;

function AccountSelection() {
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

  async function onWalletLinkConnect() {
    const address = await connectToProviderOfType(AccountTypes.WALLETLINK);
    mixpanelIdentify(address, AccountTypes.WALLETLINK);
  }

  return (
    <PageContentLayout>
      <Flex
        height="70vh"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Text.h3>Connect a wallet to get started</Text.h3>
        <Grid py="m" gridRowGap="s">
          <BrowserProviderButton
            onClick={connectBrowserWallet}
            disabled={!makerAuthenticated}
            provider={providerName}
          />
          <IconButton
            onClick={connectTrezorWallet}
            disabled={!makerAuthenticated}
            icon={<StyledTrezorLogo />}
          >
            {lang.providers.trezor}
          </IconButton>
          <IconButton
            onClick={connectLedgerWallet}
            disabled={!makerAuthenticated}
            icon={<StyledLedgerLogo />}
          >
            {lang.providers.ledger_nano}
          </IconButton>
          <IconButton
            onClick={getWalletConnectAccounts}
            icon={<StyledWalletConnectLogo />}
          >
            {lang.landing_page.wallet_connect}
          </IconButton>
          <IconButton
            onClick={onWalletLinkConnect}
            disabled={!makerAuthenticated}
            icon={<StyledWalletLinkLogo />}
          >
            {lang.landing_page.wallet_link}
          </IconButton>
          {/* <ReadOnlyConnect /> */}
        </Grid>
      </Flex>
    </PageContentLayout>
  );
}

export default hot(AccountSelection);
