import React, { useState, useRef, useEffect } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled, { css } from 'styled-components';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock';

import Sidebar from 'components/SidebarBase';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';
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
import { getMeasurement } from '../styles/theme';

import { ReactComponent as CaratDownIcon } from 'images/carat-down.svg';
import { ReactComponent as HamburgerIcon } from 'images/hamburger.svg';
import { ReactComponent as CloseIcon } from 'images/close.svg';
import { ReactComponent as ActiveHome } from 'images/active-home.svg';
import { ReactComponent as InactiveHome } from 'images/inactive-home.svg';

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
            bg="teal.500"
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
  top: ${getMeasurement('mobileNavHeight')}px;
  width: 100vw;
  z-index: 99;
  height: 100%;
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
    <DrawerBg sidebarDrawerOpen={sidebarDrawerOpen}>
      <Box
        ml="auto"
        height={`calc(100vh - ${getMeasurement('mobileNavHeight')}px)`}
        px="s"
        css={{
          overflowY: 'scroll'
        }}
      >
        {children}
      </Box>
    </DrawerBg>
  );
};
const MobileNav = ({ networkId, viewedAddress }) => {
  const ref = useRef();
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const { account } = useMaker();
  const { url } = useCurrentRoute();
  const onOverviewPage =
    account && url.pathname === `/owner/${account.address}`;

  useEffect(() => {
    if (sidebarDrawerOpen) {
      ref && ref.current && disableBodyScroll(ref.current);
    } else {
      ref && ref.current && enableBodyScroll(ref.current);
    }
    return clearAllBodyScrollLocks;
  }, [sidebarDrawerOpen]);

  return (
    <Flex
      height={getMeasurement('mobileNavHeight')}
      bg="blackLight"
      px="m"
      alignItems="center"
      width="100%"
      position="relative"
    >
      <Link href={`/${url.search}`} prefetch={true}>
        <MakerLogo />
      </Link>

      {account && (
        <Link
          href={`/owner/${account.address}`}
          css={{ margin: '0px 20px 0px 40px' }}
        >
          <Flex alignItems="center" justifyContent="center" py="s">
            {onOverviewPage ? <ActiveHome /> : <InactiveHome />}
          </Flex>
        </Link>
      )}

      <CDPDropdown>
        <CDPList
          currentPath={url.pathname}
          currentQuery={url.search}
          viewedAddress={viewedAddress}
        />
      </CDPDropdown>

      <SidebarDrawerTrigger {...{ sidebarDrawerOpen, setSidebarDrawerOpen }} />

      <div ref={ref}>
        <SidebarDrawer {...{ sidebarDrawerOpen, setSidebarDrawerOpen }}>
          <Box mr="s">
            <Sidebar
              {...{
                networkId,
                connectedAddress: account ? account.address : null
              }}
            />
          </Box>
        </SidebarDrawer>
      </div>
    </Flex>
  );
};

export default MobileNav;
