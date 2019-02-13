import React, { Fragment } from 'react';
import { NavLink, NavRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import NavLogo from 'components/NavLogo';
import { Flex } from '@makerdao/ui-components-core';

const Navbar = () => (
  <NavRoute>
    {({ url }) => (
      <Fragment>
        <NavLink href={`/${url.search}`} precache={true}>
          <Flex p="m">
            <NavLogo />
          </Flex>
        </NavLink>
        <CDPList currentPath={url.pathname} currentQuery={url.search} />
      </Fragment>
    )}
  </NavRoute>
);

export default Navbar;
