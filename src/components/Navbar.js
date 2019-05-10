import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';
import useMaker from 'hooks/useMaker';

const Navbar = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();
  const { account } = useMaker();

  return (
    <Box bg={account ? 'blackLight' : 'white'} height="100%">
      <Link href={`/${url.search}`} prefetch={true}>
        <Flex alignItems="center" justifyContent="center" py="m">
          <MakerLogo />
        </Flex>
      </Link>
      <Grid gridRowGap="xs" mx="xs">
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
