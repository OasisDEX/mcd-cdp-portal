import React, { useCallback } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import Footer from '@makerdao/ui-components-footer';
import Header from '@makerdao/ui-components-header';
import { Box, Grid } from '@makerdao/ui-components-core';
import lang from 'languages';
import { useNavigation } from 'react-navi';
import { mixpanelIdentify } from 'utils/analytics';

import LandingHeroLayout from 'layouts/LandingHeroLayout';

import BrowserProviderButton from 'components/BrowserProviderButton';
import ReadOnlyConnect from 'components/ReadOnlyConnect';
import WalletConnect from 'components/WalletConnect';
import { Title, Subtitle } from 'components/Typography';
import IconButton from 'components/IconButton';
import { getWebClientProviderName } from 'utils/web3';
import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';

import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';

const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledTrezorLogo = styled(TrezorLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

function Landing() {
  const providerName = getWebClientProviderName();
  const {
    maker,
    authenticated: makerAuthenticated,
    connectBrowserProvider
  } = useMaker();
  const navigation = useNavigation();

  const onAccountChosen = useCallback(
    async ({ address }, type) => {
      maker.useAccountWithAddress(address);
      mixpanelIdentify(address, type);
      const { search } = (await navigation.getRoute()).url;

      navigation.navigate({
        pathname: `owner/${address}`,
        search
      });
    },
    [maker, navigation]
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
    <Box width="100%">
      <Header />
      <Box bg="backgroundGrey">
        <LandingHeroLayout>
          <Box
            pb="m"
            css={`
              max-width: 500px;
            `}
          >
            <Box pb="s">
              <Title display="block">{lang.landing_page.title}</Title>
            </Box>
            <Subtitle>{lang.landing_page.subtitle}</Subtitle>
          </Box>
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
            <WalletConnect />
            <ReadOnlyConnect />
          </Grid>
        </LandingHeroLayout>
      </Box>
      <Footer />
    </Box>
  );
}

export default hot(Landing);
