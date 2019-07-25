import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';
import { ReactComponent as ActiveHome } from 'images/active-home.svg';
import { ReactComponent as InactiveHome } from 'images/inactive-home.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';
const { PREFIX } = Routes;

const Navbar = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();
  const { account } = useMaker();
  const onOverviewPage =
    account && url.pathname === `${PREFIX}/owner/${account.address}`;
  return (
    <Box bg={account ? 'blackLight' : 'white'} height="100%">
      <Link href={`/${PREFIX}/${url.search}`} prefetch={true}>
        <Flex alignItems="center" justifyContent="center" py="m">
          <MakerLogo />
        </Flex>
      </Link>

      <Grid gridRowGap="xs" mx="xs">
        {account && (
          <Link href={`/${PREFIX}/owner/${account.address}`}>
            <Flex alignItems="center" justifyContent="center" py="s">
              {onOverviewPage ? <ActiveHome /> : <InactiveHome />}
            </Flex>
          </Link>
        )}

        <CDPList
          currentPath={url.pathname}
          viewedAddress={viewedAddress}
          currentQuery={url.search}
        />
      </Grid>
    </Box>
  );
};

export default Navbar;
