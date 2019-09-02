import React from 'react';
import { useCurrentRoute } from 'react-navi';
import SaveNav from 'components/SaveNav';
import BorrowNav from 'components/BorrowNav';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';

const Navbar = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();
  const { account } = useMaker();
  const onOverviewPage =
    account && url.pathname === `/${Routes.BORROW}/owner/${account.address}`;
  return (
    <Box bg={account ? 'blackLight' : 'white'} height="100%">
      <Flex alignItems="center" justifyContent="center" py="m">
        <MakerLogo />
      </Flex>
      <Grid gridRowGap="xs" mx="xs">
        <SaveNav />
        <BorrowNav viewedAddress={viewedAddress} show={!!onOverviewPage} />
      </Grid>
    </Box>
  );
};

export default Navbar;
