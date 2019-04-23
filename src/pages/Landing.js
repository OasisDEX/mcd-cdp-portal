import React from 'react';
import { hot } from 'react-hot-loader/root';
import Footer from '@makerdao/ui-components-footer';
import Header from '@makerdao/ui-components-header';
import { Box } from '@makerdao/ui-components-core';
import lang from 'languages';

import MetaMaskConnect from 'components/MetaMaskConnect';
import ReadOnlyConnect from 'components/ReadOnlyConnect';

import HardwareWalletConnect from 'components/HardwareWalletConnect';
import WalletConnect from 'components/WalletConnect';

import { AccountTypes } from '../utils/constants';
import LandingHeroLayout from 'layouts/LandingHeroLayout';
import { Title, Subtitle } from 'components/Typography';

function Landing() {
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
          <Box px="m">
            {[
              <MetaMaskConnect key="mm" />,
              <HardwareWalletConnect key="le" type={AccountTypes.LEDGER} />,
              <HardwareWalletConnect key="tre" type={AccountTypes.TREZOR} />,
              <WalletConnect key="wc" />,
              <ReadOnlyConnect key="ro" />
            ].map(comp => (
              <Box py="xs" key={`wrap-${comp.key}`}>
                {comp}
              </Box>
            ))}
          </Box>
        </LandingHeroLayout>
      </Box>
      <Footer />
    </Box>
  );
}

export default hot(Landing);
