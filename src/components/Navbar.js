import React from 'react';
import SaveNav from 'components/SaveNav';
import BorrowNav from 'components/BorrowNav';
import TradeNav from 'components/TradeNav';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';

const Navbar = ({ viewedAddress }) => {
  const { account } = useMaker();

  return (
    <Box bg={account ? 'blueGray' : 'white'} height="100%">
      <Flex alignItems="center" justifyContent="center" py="m" />
      <Grid mx="0px">
        <SaveNav account={account} />
        <BorrowNav viewedAddress={viewedAddress} account={account} />
        <TradeNav />
      </Grid>
    </Box>
  );
};

export default Navbar;
