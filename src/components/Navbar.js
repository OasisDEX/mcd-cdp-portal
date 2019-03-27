import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import NavLogo from 'components/NavLogo';
import { Flex, Grid } from '@makerdao/ui-components-core';

const Navbar = ({ address }) => {
  const { url } = useCurrentRoute();
  return (
    <Fragment>
      <Link href={`/${url.search}`} prefetch={true}>
        <Flex alignItems="center" justifyContent="center" py="m">
          <NavLogo />
        </Flex>
      </Link>
      <Grid gridRowGap="xs">
        <CDPList
          currentPath={url.pathname}
          currentQuery={url.search}
          // address={address}
          isOwner={address}
        />
      </Grid>
    </Fragment>
  );
};

export default Navbar;
