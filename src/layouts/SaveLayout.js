import React from 'react';
import { Flex, Box, Grid } from '@makerdao/ui-components-core';
import { hot } from 'react-hot-loader/root';
import theme, { getSpace } from '../styles/theme';

//

const ResponsivePageLayout = ({ mobileNav, navbar, children }) => {
  return (
    <Grid
      bg="backgroundGrey"
      gridTemplateColumns={{
        s: 'minmax(0, 1fr)',
        xl: `${theme.measurement.navbarWidth}px 1fr ${
          theme.measurement.sidebarWidth
        }px ${getSpace('s')}px`
      }}
      gridTemplateRows={{
        s: 'auto 1fr',
        xl: 'auto'
      }}
      width="100%"
    >
      <Box display={{ s: 'block', xl: 'none' }}>{mobileNav}</Box>
      <Box display={{ s: 'none', xl: 'block' }}>{navbar}</Box>
      <div>{children}</div>
    </Grid>
  );
};

export default hot(ResponsivePageLayout);
