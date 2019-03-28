import React, { Fragment } from 'react';
import { NavLink, NavRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import NavLogo from 'components/NavLogo';
import { Flex, Grid } from '@makerdao/ui-components-core';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';

const Navbar = ({ viewedAddress }) => {
  return (
    <NavRoute>
      {({ url }) => (
        <Fragment>
          <NavLink href={`/${url.search}`} precache={true}>
            <Flex alignItems="center" justifyContent="center" py="m">
              <MakerLogo />
            </Flex>
          </NavLink>
          <Grid gridRowGap="xs">
            <CDPList
              currentPath={url.pathname}
              viewedAddress={viewedAddress}
              currentQuery={url.search}
            />
          </Grid>
        </Fragment>
      )}
    </NavRoute>
  );
};

export default Navbar;
