import React from 'react';
import SaveNav from 'components/SaveNav';
import BorrowNav from 'components/BorrowNav';
import TradeNav from 'components/TradeNav';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';

const navbarFill = '#1E2C37';

const Navbar = ({ viewedAddress }) => {
  const { account } = useMaker();

  return (
    <Box bg={navbarFill} height="100%">
      <Flex alignItems="center" justifyContent="center" py="m" />
      <Grid gridRowGap="xs" mx="xs">
        <SaveNav />
        <BorrowNav viewedAddress={viewedAddress} />
        <TradeNav />
      </Grid>
    </Box>
  );
};

export default Navbar;
