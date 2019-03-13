import React, { Fragment } from 'react';
import { NavLink, NavRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import NavLogo from 'components/NavLogo';
import { Flex, Grid } from '@makerdao/ui-components-core';

const Navbar = ({ address }) => (
  <NavRoute>
    {({ url }) => (
      <Fragment>
        <NavLink href={`/${url.search}`} precache={true}>
          <Flex alignItems="center" justifyContent="center" py="m">
            <NavLogo />
          </Flex>
        </NavLink>
        <Grid gridRowGap="xs">
          <CDPList
            currentPath={url.pathname}
            currentQuery={url.search}
            address={address}
          />
        </Grid>
      </Fragment>
    )}
  </NavRoute>
);

export default Navbar;
