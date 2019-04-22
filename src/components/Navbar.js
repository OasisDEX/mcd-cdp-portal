import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Grid } from '@makerdao/ui-components-core';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';

const Navbar = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default Navbar;
