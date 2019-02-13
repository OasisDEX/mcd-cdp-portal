import React, { Fragment } from 'react';
import { NavLink, NavRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import NavLogo from 'components/NavLogo';

const Navbar = () => (
  <NavRoute>
    {({ url }) => (
      <Fragment>
        <NavLink href={`/${url.search}`} precache={true}>
          <NavLogo />
        </NavLink>
        <CDPList currentPath={url.pathname} currentQuery={url.search} />
      </Fragment>
    )}
  </NavRoute>
);

export default Navbar;
