import React, { Fragment, useState } from 'react';
import { NavLink, NavRoute } from 'react-navi';
import styled, { css } from 'styled-components';

import Sidebar from 'components/Sidebar';
import NavLogo from 'components/NavLogo';
import {
  Dropdown,
  DefaultDropdown,
  Flex,
  Box
} from '@makerdao/ui-components-core';
import CDPList from 'components/CDPList';
import { ReactComponent as CaratDownIcon } from 'images/carat-down.svg';
import { ReactComponent as HamburgerIcon } from 'images/hamburger.svg';
import { ReactComponent as CloseIcon } from 'images/close.svg';

const CDPDropdown = ({ children }) => {
  return (
    <Dropdown
      css={{
        marginLeft: '25px'
      }}
      trigger={
        <Flex alignItems="center">
          <Flex
            alignItems="center"
            justifyContent="center"
            css={`
              font-size: 1.2rem;
              font-weight: 700;
              border-radius: 4px;
              background: #1aab9b;
              width: 66px;
              height: 54px;
            `}
          >
            ETH
          </Flex>
          <Box ml="s">
            <CaratDownIcon />
          </Box>
        </Flex>
      }
    >
      <DefaultDropdown>{children}</DefaultDropdown>
    </Dropdown>
  );
};

const SidebarDrawerTrigger = ({ sidebarDrawerOpen, setSidebarDrawerOpen }) => {
  return (
    <Box
      ml="auto"
      p="s"
      onClick={() => setSidebarDrawerOpen(!sidebarDrawerOpen)}
    >
      {sidebarDrawerOpen ? <CloseIcon /> : <HamburgerIcon />}
    </Box>
  );
};

const DrawerBg = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 80px;
  z-index: 999;
  background-color: rgba(72, 73, 95, 0.25);
  ${({ sidebarDrawerOpen }) =>
    sidebarDrawerOpen
      ? css`
          display: flex;
        `
      : css`
          display: none;
        `}
`;

const SidebarDrawer = ({
  sidebarDrawerOpen,
  setSidebarDrawerOpen,
  children
}) => {
  return (
    <DrawerBg
      sidebarDrawerOpen={sidebarDrawerOpen}
      onClick={() => setSidebarDrawerOpen(false)}
    >
      <Box
        css={{
          maxWidth: '320px',
          backgroundColor: 'white',
          marginLeft: 'auto'
        }}
      >
        {children}
      </Box>
    </DrawerBg>
  );
};
const MobileNav = ({ network, address }) => {
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

  return (
    <NavRoute>
      {({ url }) => (
        <Fragment>
          <NavLink href={`/${url.search}`} precache={true}>
            <NavLogo />
          </NavLink>

          <CDPDropdown>
            <CDPList currentPath={url.pathname} currentQuery={url.search} />
          </CDPDropdown>

          <SidebarDrawerTrigger
            {...{ sidebarDrawerOpen, setSidebarDrawerOpen }}
          />
          <SidebarDrawer {...{ sidebarDrawerOpen, setSidebarDrawerOpen }}>
            <Sidebar {...{ network, address }} />
          </SidebarDrawer>
        </Fragment>
      )}
    </NavRoute>
  );
};

export default MobileNav;
