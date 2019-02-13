import React, { Fragment } from 'react';
import styled from 'styled-components';
import { NavLink, NavRoute } from 'react-navi';
import Sidebar from 'components/Sidebar';
import NavLogo from 'components/NavLogo';

import CDPList from 'components/CDPList';
const CDPDropdown = styled.div``;
const MenuDropdown = styled.div``;

const MobileNav = ({ network, address }) => (
  <NavRoute>
    {({ url }) => (
      <Fragment>
        <NavLink href={`/${url.search}`} precache={true}>
          <NavLogo />
        </NavLink>

        <CDPDropdown>
          <CDPList currentPath={url.pathname} currentQuery={url.search} />
        </CDPDropdown>

        <MenuDropdown>
          <Sidebar {...{ network, address }} />
        </MenuDropdown>
      </Fragment>
    )}
  </NavRoute>
);

export default MobileNav;
