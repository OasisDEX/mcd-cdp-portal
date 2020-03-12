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

import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { ReactComponent as WalletConnectLogo } from 'images/wallet-connect.svg';
import { ReactComponent as WalletLinkLogo } from 'images/wallet-link.svg';
import { AccountTypes } from 'utils/constants';
import { BrowserView } from 'react-device-detect';

const StyledLedgerLogo = styled(LedgerLogo)`
  max-width: 16px;
  max-height: 16px;
`;

export const StyledTrezorLogo = styled(TrezorLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

export const StyledWalletConnectLogo = styled(WalletConnectLogo)`
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

  return (
    <PageContentLayout>
      <Flex
        height="70vh"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Text.h4>{lang.providers.connect_wallet}</Text.h4>
        <Grid py="l" gridRowGap="s">
          <BrowserProviderButton
            onClick={connectBrowserWallet}
            disabled={!makerAuthenticated}
            provider={providerName}
            css={{
              backgroundColor: 'white'
            }}
          />
          <BrowserView>
            <IconButton
              onClick={connectTrezorWallet}
              disabled={!makerAuthenticated}
              icon={<StyledTrezorLogo />}
              css={{
                backgroundColor: 'white'
              }}
            >
              {lang.providers.trezor}
            </IconButton>
          </BrowserView>
          <BrowserView>
            <IconButton
              onClick={connectLedgerWallet}
              disabled={!makerAuthenticated}
              icon={<StyledLedgerLogo />}
              css={{
                backgroundColor: 'white'
              }}
            >
              {lang.providers.ledger_nano}
            </IconButton>
          </BrowserView>
          <BrowserView>
            <IconButton
              onClick={() =>
                connectToProviderOfType(AccountTypes.WALLETCONNECT)
              }
              icon={<StyledWalletConnectLogo />}
              css={{
                backgroundColor: 'white'
              }}
            >
              {lang.landing_page.wallet_connect}
            </IconButton>
          </BrowserView>
          <BrowserView>
            <IconButton
              onClick={() => connectToProviderOfType(AccountTypes.WALLETLINK)}
              disabled={!makerAuthenticated}
              icon={<StyledWalletLinkLogo />}
              css={{
                backgroundColor: 'white'
              }}
            >
              {lang.landing_page.wallet_link}
            </IconButton>
          </BrowserView>
          {/* <ReadOnlyConnect /> */}
        </Grid>
      </Flex>
    </PageContentLayout>
  );
}

export default hot(AccountSelection);
