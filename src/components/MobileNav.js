import React, { memo, useState, useRef, useEffect, Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled, { css } from 'styled-components';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock';
import useStore from 'hooks/useStore';

import RatioDisplay from './RatioDisplay';
import { getCdp, getCollateralizationRatio } from 'reducers/cdps';
import { ReactComponent as MakerLogo } from 'images/maker-logo.svg';
import SidebarGlobal from './Sidebars/Global';
import AccountBox from './AccountBox';

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

const NavbarIcon = ({ owned, label, ratio, connected }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    bg={label ? 'teal.500' : 'black.500'}
    borderRadius="default"
    height="50px"
    width="64px"
  >
    {label ? (
      <Fragment>
        <Text t="p6" fontWeight="bold" color={owned ? 'white' : 'darkPurple'}>
          {label}
        </Text>
        <RatioDisplay fontSize="1.3rem" ratio={ratio} active />
      </Fragment>
    ) : connected ? (
      <ActiveHome />
    ) : (
      <InactiveHome />
    )}
  </Flex>
);

const CDPDropdown = memo(function({ iconData, children }) {
  const { label, owned, ratio, connected } = iconData;
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
            bg="black.500"
            borderRadius="4px"
          >
            <NavbarIcon
              label={label}
              owned={owned}
              ratio={ratio}
              connected={connected}
            />
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
});

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
  z-index: 9;
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

const SidebarDrawer = ({ sidebarDrawerOpen, children }) => {
  return (
    <DrawerBg sidebarDrawerOpen={sidebarDrawerOpen}>
      <Box
        ml="auto"
        height={`calc(100vh - ${getMeasurement('mobileNavHeight')}px)`}
        px="s"
        width="100vw"
        css={{ overflowY: 'scroll', paddingRight: 0 }}
      >
        {children}
      </Box>
    </DrawerBg>
  );
};
const MobileNav = ({ viewedAddress, cdpId }) => {
  const ref = useRef();
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const { account } = useMaker();
  const { url } = useCurrentRoute();
  const onOverviewPage =
    account && url.pathname === `/owner/${account.address}`;

  const [{ cdps, feeds }] = useStore();

  useEffect(() => {
    if (sidebarDrawerOpen) {
      ref && ref.current && disableBodyScroll(ref.current);
    } else {
      ref && ref.current && enableBodyScroll(ref.current);
    }
    return clearAllBodyScrollLocks;
  }, [sidebarDrawerOpen]);

  let iconData;
  if (cdpId) {
    const cdp = getCdp(cdpId, { cdps, feeds });
    const ratio = getCollateralizationRatio(cdp, true, 0);
    const owned = Object.keys(cdps).includes(cdpId);

    iconData = { label: cdp.ilk, ratio, owned, connected: !!account };
  } else {
    iconData = { connected: !!account };
  }

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
        <CDPDropdown iconData={iconData}>
          <Link href={`/owner/${account.address}`}>
            <Flex alignItems="center" justifyContent="center" py="s">
              {onOverviewPage ? <ActiveHome /> : <InactiveHome />}
            </Flex>
          </Link>

          <CDPList
            currentPath={url.pathname}
            currentQuery={url.search}
            viewedAddress={viewedAddress}
          />
        </CDPDropdown>
      )}

      <SidebarDrawerTrigger {...{ sidebarDrawerOpen, setSidebarDrawerOpen }} />

      <div ref={ref}>
        <SidebarDrawer {...{ sidebarDrawerOpen, setSidebarDrawerOpen }}>
          <Box mr="s">
            <Box my="s">
              <AccountBox currentAccount={account} />
            </Box>
            <SidebarGlobal />
          </Box>
        </SidebarDrawer>
      </div>
    </Flex>
  );
};

export default MobileNav;
