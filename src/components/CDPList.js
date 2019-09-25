import debounce from 'lodash.debounce';
import React, {
  memo,
  useEffect,
  useState,
  useRef,
  useMemo,
  Fragment
} from 'react';
import styled from 'styled-components';
import { ReactComponent as Plus } from '../images/plus.svg';
import { ReactComponent as NavUp } from '../images/nav-up-icon.svg';
import { ReactComponent as NavDown } from '../images/nav-down-icon.svg';
import { Flex, Text, Box } from '@makerdao/ui-components-core';
import RatioDisplay from './RatioDisplay';
import { Link, useCurrentRoute } from 'react-navi';
import useModal from 'hooks/useModal';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import { trackCdpById } from 'reducers/multicall/cdps';
import { getCdp, getCollateralizationRatio } from 'reducers/cdps';
import round from 'lodash/round';
import { Routes } from '../utils/constants';
import { getMeasurement } from '../styles/theme';

const NavbarItemContent = ({ children, ...props }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    borderRadius="default"
    {...props}
  >
    {children}
  </Flex>
);

const NavbarItem = ({ href, owned, active, ...props }) => (
  <Link
    href={href}
    active={active}
    prefetch={true}
    css={`
      display: block;
    `}
    {...props}
  >
    <NavbarItemContent {...props} />
  </Link>
);

const AddCdpButton = ({ account, show, mobile }) => (
  <Flex
    onClick={() =>
      account && show({ modalType: 'cdpcreate', modalTemplate: 'fullscreen' })
    }
    width={
      mobile
        ? `${getMeasurement('navbarItemWidth')}px`
        : `${getMeasurement('navbarWidth')}px`
    }
    mx={mobile && '7px'}
    mt={mobile && '15px'}
    justifyContent="center"
    borderRadius="4px"
    py="s"
    css={`
      cursor: pointer;
    `}
  >
    <Plus />
  </Flex>
);

const DirectionalButton = styled(NavbarItemContent)`
  height: 35px;
  cursor: pointer;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
`;

const CdpContainer = styled(Flex)`
  cursor: pointer;
  flex-direction: ${props => (props.mobile ? 'row' : 'column')};
  flex-wrap: ${props => (props.mobile ? 'wrap' : undefined)};
  overflow: auto;
  height: ${props => props.cdpsLength >= 4 && !props.mobile && '275px'};
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const CDPList = memo(function({
  currentPath,
  viewedAddress,
  currentQuery,
  mobile
}) {
  const { url } = useCurrentRoute();
  const [listOpen, setListOpen] = useState(false);
  const { maker, account } = useMaker();
  const [{ cdps, feeds }, dispatch] = useStore();
  const [ratios, setRatios] = useState([]);
  const [navbarCdps, setNavbarCdps] = useState([]);
  const [overviewPath, setOverviewPath] = useState(currentPath);
  const active = currentPath === overviewPath;

  useMemo(() => {
    const onSavePage = url.pathname === `/${Routes.SAVE}`;
    if (onSavePage) {
      setListOpen(false);
    } else if (!onSavePage && (account || viewedAddress)) {
      setListOpen(true);
    }
  }, [account, url, viewedAddress]);

  useEffect(() => {
    if (account) {
      setOverviewPath(`/${Routes.BORROW}/owner/${account.address}`);
      account.cdps.forEach(cdp => trackCdpById(maker, cdp.id, dispatch));
      setNavbarCdps(account.cdps);
    } else if (viewedAddress) {
      setOverviewPath(`/${Routes.BORROW}/owner/${viewedAddress}`);
      (async () => {
        const proxy = await maker
          .service('proxy')
          .getProxyAddress(viewedAddress);
        if (!proxy) return;
        const cdps = await maker.service('mcd:cdpManager').getCdpIds(proxy);
        cdps.forEach(cdp => trackCdpById(maker, cdp.id, dispatch));
        setNavbarCdps(cdps);
      })();
    }
  }, [maker, account, viewedAddress, dispatch, setOverviewPath]);

  useEffect(() => {
    if (account || viewedAddress) {
      const ratios = navbarCdps.map(({ id: cdpId }) => {
        const cdp = getCdp(cdpId, { cdps, feeds });
        return {
          liquidationRatio: cdp.liquidationRatio,
          collateralizationRatio: getCollateralizationRatio(cdp)
        };
      });
      setRatios(ratios);
    }
  }, [account, navbarCdps, cdps, feeds, viewedAddress]);

  const [scrollPosition, setScrollPosition] = useState({
    scrollTop: 0,
    maxScrollTop: 1
  });
  const { scrollTop, maxScrollTop } = scrollPosition;

  const cdpContainerRef = useRef(null);

  const handleOnScroll = () => {
    const maxScrollTop =
      cdpContainerRef.current.scrollHeight -
      cdpContainerRef.current.clientHeight;

    setScrollPosition({
      ...scrollPosition,
      scrollTop: cdpContainerRef.current.scrollTop,
      maxScrollTop
    });
  };

  const debounced = debounce(handleOnScroll, 100);

  const onDirectionalClick = direction => {
    const scrollAmount =
      cdpContainerRef.current.scrollHeight / navbarCdps.length;
    const maxScrollTop =
      cdpContainerRef.current.scrollHeight -
      cdpContainerRef.current.clientHeight;

    setScrollPosition({
      ...scrollPosition,
      scrollAmount
    });
    let newPosition =
      direction === 'up' && scrollAmount
        ? scrollTop - scrollAmount
        : scrollTop + scrollAmount;
    if (newPosition < 0) newPosition = 0;
    if (newPosition > maxScrollTop) newPosition = maxScrollTop;
    setScrollPosition({
      ...scrollPosition,
      scrollTop: newPosition,
      maxScrollTop
    });
    cdpContainerRef.current.scrollTop = newPosition;
  };

  const { show } = useModal();

  const getBgColor = (active, account) =>
    active && account
      ? 'blueGrayLighter'
      : !active && account
      ? 'blueGrayDarker'
      : active && !account
      ? 'teal.500'
      : 'grey.200';

  return listOpen ? (
    <Fragment>
      {navbarCdps.length >= 4 && !mobile && (
        <DirectionalButton
          onClick={() => onDirectionalClick('up')}
          show={scrollTop > 0}
          bg={account ? 'blueGrayDarker' : 'white'}
        >
          <NavUp />
        </DirectionalButton>
      )}
      <Box
        bg={account ? 'blueGrayDarker' : 'white'}
        height="100%"
        width={mobile ? '100vw' : `${getMeasurement('navbarWidth')}px`}
        px={mobile ? '15px' : '5px'}
        pb={mobile && '15px'}
      >
        <CdpContainer
          onScroll={debounced}
          ref={cdpContainerRef}
          cdpsLength={navbarCdps.length}
          mobile={mobile}
          pb="5px"
        >
          <NavbarItem
            key={navbarCdps.length * 10}
            href={overviewPath + currentQuery}
            mx={mobile && '7px'}
            mt={mobile ? '15px' : '5px'}
            bg={getBgColor(active, account)}
            height={`${getMeasurement('navbarItemHeight')}px`}
            width={`${getMeasurement('navbarItemWidth')}px`}
          >
            <Text
              t="p6"
              fontWeight="bold"
              color={account ? 'white' : 'darkPurple'}
            >
              Overview
            </Text>
          </NavbarItem>
          {navbarCdps.map((cdp, idx) => {
            const liquidationRatio = ratios[idx]
              ? ratios[idx].liquidationRatio
              : null;
            const collateralizationRatio = ratios[idx]
              ? round(ratios[idx].collateralizationRatio, 0)
              : null;
            const linkPath = `/${Routes.BORROW}/${cdp.id}`;
            const active = currentPath === linkPath;
            return (
              <NavbarItem
                key={idx}
                href={linkPath + currentQuery}
                mx={mobile && '7px'}
                mt={mobile ? '15px' : '5px'}
                bg={getBgColor(active, account)}
                height={`${getMeasurement('navbarItemHeight')}px`}
                width={`${getMeasurement('navbarItemWidth')}px`}
              >
                <Text
                  t="p6"
                  fontWeight="bold"
                  color={account ? 'white' : 'darkPurple'}
                >
                  {cdp.ilk}
                </Text>
                <RatioDisplay
                  fontSize="1.3rem"
                  ratio={collateralizationRatio}
                  ilkLiqRatio={liquidationRatio}
                  active={active}
                />
              </NavbarItem>
            );
          })}
          {account && mobile && (
            <AddCdpButton account={account} show={show} mobile={mobile} />
          )}
        </CdpContainer>
      </Box>
      {navbarCdps.length >= 4 && !mobile && (
        <DirectionalButton
          onClick={() => onDirectionalClick('down')}
          show={scrollTop < maxScrollTop}
          bg={account ? 'blueGrayDarker' : 'white'}
        >
          <NavDown />
        </DirectionalButton>
      )}
      {account && !mobile && (
        <AddCdpButton account={account} show={show} mobile={mobile} />
      )}
    </Fragment>
  ) : null;
});

export default CDPList;
