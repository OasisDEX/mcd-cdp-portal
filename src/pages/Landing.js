import React from 'react';
import { hot } from 'react-hot-loader/root';
import Footer from '@makerdao/ui-components-footer';
import Header from '@makerdao/ui-components-header';
import { Box } from '@makerdao/ui-components-core';

import LandingHeroLayout from 'layouts/LandingHeroLayout';

import { Title } from 'components/Typography';

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
              <Title display="block">Oasis</Title>
              <p>
                CDP portal has been moved to <a href="/borrow">/borrow</a>
              </p>
            </Box>
          </Box>
        </LandingHeroLayout>
      </Box>
      <Footer />
    </Box>
  );
}

export default hot(Landing);
