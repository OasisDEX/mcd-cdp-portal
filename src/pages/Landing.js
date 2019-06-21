import React, { useCallback } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import Footer from '@makerdao/ui-components-footer';
import Header from '@makerdao/ui-components-header';
import { Box, Grid } from '@makerdao/ui-components-core';
import lang from 'languages';
import { useNavigation } from 'react-navi';
import { mixpanelIdentify } from 'utils/analytics';
import ConnectDaiWallet from '../connect-dai-wallet';
import LandingHeroLayout from 'layouts/LandingHeroLayout';
import { Title, Subtitle } from 'components/Typography';
import IconButton from 'components/IconButton';

function Landing() {
  const navigation = useNavigation();

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
            <ConnectDaiWallet
              analytics={params =>
                mixpanelIdentify(params.address, params.type)
              }
              navigation={async params => {
                const { search } = (await navigation.getRoute()).url;
                navigation.navigate({
                  pathname: `owner/${params.address}`,
                  search
                });
              }}
            />
          </Grid>
        </LandingHeroLayout>
      </Box>
      <Footer />
    </Box>
  );
}

export default hot(Landing);
