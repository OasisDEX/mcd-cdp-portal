import React, { Fragment, useState } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled, { css } from 'styled-components';

import Sidebar from 'components/Sidebar';
import NavLogo from 'components/NavLogo';
import {
  Dropdown,
  DefaultDropdown,
  Flex,
  Box,
  Text,
  Grid
} from '@makerdao/ui-components-core';
import CDPList from 'components/CDPList';
import useMaker from 'hooks/useMaker';

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
            px="m"
            py="s"
            bg="greenPastel"
            borderRadius="4px"
          >
            <Text t="p6" fontWeight="bold">
              ETH
            </Text>
          </Flex>
          <Box ml="s">
            <CaratDownIcon />
          </Box>
        </Flex>
      }
    >
      <DefaultDropdown>
        <Grid
          gridTemplateColumns="64px 64px"
          gridColumnGap="xs"
          gridRowGap="xs"
        >
          {children}
        </Grid>
      </DefaultDropdown>
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
          overflow: 'scroll',
          marginLeft: 'auto'
        }}
      >
        {children}
      </Box>
    </DrawerBg>
  );
};
const MobileNav = ({ networkId, viewedAddress }) => {
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const { account } = useMaker();
  const { url } = useCurrentRoute();

  return (
    <Fragment>
      <Link href={`/${url.search}`} prefetch={true}>
        <NavLogo />
      </Link>

      <CDPDropdown>
        <CDPList
          currentPath={url.pathname}
          currentQuery={url.search}
          viewedAddress={viewedAddress}
        />
      </CDPDropdown>

      <SidebarDrawerTrigger {...{ sidebarDrawerOpen, setSidebarDrawerOpen }} />
      <SidebarDrawer {...{ sidebarDrawerOpen, setSidebarDrawerOpen }}>
        <Sidebar
          {...{ networkId, connectedAddress: account ? account.address : null }}
        />
      </SidebarDrawer>
    </Fragment>
  );
};

export default MobileNav;
