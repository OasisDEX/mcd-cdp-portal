import React from 'react';
import Footer from '@makerdao/ui-components-footer';
import Header from '@makerdao/ui-components-header';
import { Box } from '@makerdao/ui-components-core';
import { Block } from 'components/Primitives';
import lang from 'languages';

import MetaMaskConnect from 'components/MetaMaskConnect';
import ReadOnlyConnect from 'components/ReadOnlyConnect';

import LedgerConnect from 'components/LedgerConnect';
import TrezorConnect from 'components/TrezorConnect';
import WalletConnect from 'components/WalletConnect';

import LandingHeroLayout from 'layouts/LandingHeroLayout';
import { Title, Subtitle } from 'components/Typography';

function Landing() {
  return (
    <Block width="100%">
      <Header />
      <Block bg="backgroundGrey">
        <LandingHeroLayout>
          <Block
            pb="m"
            css={`
              max-width: 500px;
            `}
          >
            <Box pb="s">
              <Title display="block">{lang.landing_page.title}</Title>
            </Box>
            <Subtitle>{lang.landing_page.subtitle}</Subtitle>
          </Block>
          <Block px="m">
            {[
              <MetaMaskConnect key="mm" />,
              <LedgerConnect key="le" />,
              <TrezorConnect key="tre" />,
              <WalletConnect key="wc" />,
              <ReadOnlyConnect key="ro" />
            ].map(comp => (
              <Block py="xs" key={`wrap-${comp.key}`}>
                {comp}
              </Block>
            ))}
          </Block>
        </LandingHeroLayout>
      </Block>
      <Footer />
    </Block>
  );
}

export default Landing;
