import React from 'react';
import { hot } from 'react-hot-loader/root';
import Footer from '@makerdao/ui-components-footer';
import Header from '@makerdao/ui-components-header';
import { Box, Grid } from '@makerdao/ui-components-core';
import lang from 'languages';

import BrowserProviderConnect from 'components/BrowserProviderConnect';
import ReadOnlyConnect from 'components/ReadOnlyConnect';

import HardwareWalletConnect from 'components/HardwareWalletConnect';
import WalletConnect from 'components/WalletConnect';

import { AccountTypes } from '../utils/constants';
import LandingHeroLayout from 'layouts/LandingHeroLayout';
import { Title, Subtitle } from 'components/Typography';
import { getWebClientProviderName } from 'utils/web3';

function Landing() {
  const providerName = getWebClientProviderName();

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
            <BrowserProviderConnect provider={providerName} />
            <HardwareWalletConnect type={AccountTypes.LEDGER} />
            <HardwareWalletConnect type={AccountTypes.TREZOR} />
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
