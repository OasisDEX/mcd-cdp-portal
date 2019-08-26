import React from 'react';
import { Flex, Box, Grid } from '@makerdao/ui-components-core';
import Header from '@makerdao/ui-components-header';
import { hot } from 'react-hot-loader/root';

import Subheader from '../components/Save/Subheader';
import Footer from '../components/Save/Footer';

const AppLayout = ({ children }) => {
  return (
    <Grid bg="backgroundGrey" width="100%">
      <Flex height="100%" flexDirection="column" minHeight="100vh">
        <Header />
        <Subheader />
        {children}
        <Box flexGrow="1" />
        <Footer />
      </Flex>
    </Grid>
  );
};

export default hot(AppLayout);
