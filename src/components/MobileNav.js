import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  Fragment
} from 'react';
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
import WalletConnectDropdown from 'components/WalletConnectDropdown';
import { getSpace } from 'styles/theme';

import {
  Dropdown,
  DefaultDropdown,
  Flex,
  Box,
  Text,
  Grid,
  Button
} from '@makerdao/ui-components-core';
import CDPList from 'components/CDPList';
import useMaker from 'hooks/useMaker';
import { getMeasurement } from '../styles/theme';
import lang from 'languages';

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
  const [show, setShow] = useState(false);
  return (
    <Dropdown
      hitBoxMargin="0px"
      show={show}
      trigger={
        <Flex
          alignItems="center"
          justifyContent="center"
          p="s"
          bg="black.500"
          borderRadius="4px"
          onClick={() => setShow(!show)}
        >
          <NavbarIcon
            label={label}
            owned={owned}
            ratio={ratio}
            connected={connected}
          />
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
          onClick={() => setShow(!show)}
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

const LogoLink = styled(Link)`
  padding: 12px;
  margin-right: 12px;
`;

const MobileNav = ({ viewedAddress, cdpId }) => {
  const ref = useRef();
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const { account } = useMaker();
  const { url } = useCurrentRoute();
  const onOverviewPage =
    account && url.pathname === `/owner/${account.address}`;
  const [open, setOpen] = useState(false);
  const toggleDropdown = useCallback(() => setOpen(!open), [open, setOpen]);
  const closeDropdown = useCallback(() => setOpen(false), [setOpen]);

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
      <LogoLink href={`/${url.search}`} prefetch={true}>
        <MakerLogo />
      </LogoLink>

      {account ? (
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
      ) : (
        <Box px="s">
          <WalletConnectDropdown
            show={open}
            offset={`-${getSpace('s') + 1}, 0`}
            openOnHover={false}
            onClick={toggleDropdown}
            close={closeDropdown}
            hitBoxMargin="0px"
            trigger={
              <Button
                ml="auto"
                px="s"
                py="xs"
                height="auto"
                variant="secondary"
              >
                {lang.connect}
              </Button>
            }
          />
        </Box>
      )}

      <SidebarDrawerTrigger {...{ sidebarDrawerOpen, setSidebarDrawerOpen }} />

      <DrawerBg sidebarDrawerOpen={sidebarDrawerOpen}>
        <Box
          ref={ref}
          ml="auto"
          height={`calc(100vh - ${getMeasurement('mobileNavHeight')}px)`}
          px="s"
          width="100vw"
          css={{ overflowY: 'scroll', paddingRight: 0 }}
        >
          <Box mr="s">
            <Box my="s">
              {account && <AccountBox currentAccount={account} />}
            </Box>
            <SidebarGlobal />
          </Box>
        </Box>
      </DrawerBg>
    </Flex>
  );
};

export default MobileNav;
