import React, { useState, useCallback } from 'react';
import { useCurrentRoute } from 'react-navi';
import SaveNav from 'components/SaveNav';
import BorrowNav from 'components/BorrowNav';
import { Flex, Grid, Box, Button } from '@makerdao/ui-components-core';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';

const navbarFill = '#1E2C37';

const Navbar = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();
  const { account } = useMaker();

  return (
    <Box bg={account ? navbarFill : 'white'} height="100%">
      <Flex alignItems="center" justifyContent="center" py="m">
        <MakerLogo />
      </Flex>
      <Grid gridRowGap="xs" mx="xs">
        <SaveNav />
        <BorrowNav viewedAddress={viewedAddress} />
      </Grid>
    </Box>
  );
};

export default Navbar;
