import React, { useCallback } from 'react';
import lang from 'languages';
import styled from 'styled-components';

import { Grid } from '@makerdao/ui-components-core';
import BrowserProviderButton from 'components/BrowserProviderButton';
import IconButton from 'components/IconButton';
// import ReadOnlyConnect from 'components/ReadOnlyConnect'

import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';

import { getWebClientProviderName } from 'utils/web3';
import { getWalletConnectAccounts } from 'utils/walletconnect';

import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { ReactComponent as WalletConnectLogo } from 'images/wallet-connect.svg';

const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px
  margin-bottom: -5px
`;

const StyledTrezorLogo = styled(TrezorLogo)`
  margin-top: -5px
  margin-bottom: -5px
`;

const StyledWalletConnectLogo = styled(WalletConnectLogo)`
  margin-top: -5px
  margin-bottom: -5px
`;

function WalletConnect(props) {
  const {
    maker,
    authenticated: makerAuthenticated,
    connectBrowserProvider
  } = useMaker();
  const { analytics, navigation } = props;
  // const navigation = useNavigation()

  const onAccountChosen = useCallback(
    async ({ address }, type) => {
      maker.useAccountWithAddress(address);
      analytics && analytics({ address, type });
      navigation && navigation({ address });
    },
    [maker, analytics, navigation]
  );

  const providerName = getWebClientProviderName();

  async function connectBrowserWallet() {
    try {
      const connectedAddress = await connectBrowserProvider();
      onAccountChosen({ address: connectedAddress }, providerName);
    } catch (err) {
      window.alert(err);
    }
  }
  const { connectTrezorWallet } = useTrezor({ onAccountChosen });
  const { connectLedgerWallet } = useLedger({ onAccountChosen });

  return (
    <Grid px="m" py="xs" gridRowGap="s">
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
      {/* <ReadOnlyConnect /> */}
    </Grid>
  );
}

export default WalletConnect;
