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

const NavbarItemContainer = styled(Link)`
  display: block;
`;

const DashedFakeButton = styled(Flex)`
  cursor: pointer;
`;

const DirectionalButton = ({ connected, direction, show, onClick }) => {
  return (
    <Flex
      onClick={() => onClick(direction)}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={connected ? 'blueGrayDarker' : 'white'}
      borderRadius="default"
      height="35px"
      css={`
        cursor: pointer;
        visibility: ${show ? 'visible' : 'hidden'};
      `}
    >
      {direction === 'up' ? <NavUp /> : <NavDown />}
    </Flex>
  );
};

const NavbarItem = ({ href, label, ratio, owned, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} prefetch={true} {...props}>
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={
        active && owned
          ? 'blueGrayLighter'
          : !active && owned
          ? 'blueGrayDarker'
          : active && !owned
          ? 'teal.500'
          : 'grey.200'
      }
      borderRadius="default"
      height="50px"
      mt="5px"
    >
      <Text t="p6" fontWeight="bold" color={owned ? 'white' : 'darkPurple'}>
        {label}
      </Text>
      {ratio && (
        <RatioDisplay fontSize="1.3rem" ratio={ratio} active={active} />
      )}
    </Flex>
  </NavbarItemContainer>
);

const CdpContainer = styled(Flex)`
  width: 100%;
  py: '10px';
  cursor: pointer;
  flex-direction: column;
  overflow: auto;
  height: ${props => (props.cdpsLength >= 4 ? '275px' : undefined)};
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const CDPList = memo(function({ currentPath, viewedAddress, currentQuery }) {
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
        return getCollateralizationRatio(cdp);
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

  return listOpen ? (
    <Fragment>
      {navbarCdps.length >= 4 && (
        <DirectionalButton
          connected={account}
          show={scrollTop > 0}
          onClick={onDirectionalClick}
          direction={'up'}
        />
      )}
      <Box bg={account ? 'blueGrayDarker' : 'white'} height="100%" px="5px">
        <CdpContainer
          onScroll={debounced}
          ref={cdpContainerRef}
          cdpsLength={navbarCdps.length}
        >
          {navbarCdps.length > 0 && (
            <NavbarItem
              key={navbarCdps.length * 10}
              href={overviewPath + currentQuery}
              label={'Overview'}
              owned={account}
              active={active}
            />
          )}
          {navbarCdps.map((cdp, idx) => {
            const ratio = ratios[idx] ? round(ratios[idx], 0) : null;
            const linkPath = `/${Routes.BORROW}/${cdp.id}`;
            const active = currentPath === linkPath;
            return (
              <NavbarItem
                key={idx}
                href={linkPath + currentQuery}
                label={cdp.ilk}
                owned={account}
                active={active}
                ratio={ratio}
              />
            );
          })}
        </CdpContainer>
      </Box>
      {navbarCdps.length >= 4 && (
        <DirectionalButton
          connected={account}
          show={scrollTop < maxScrollTop}
          onClick={onDirectionalClick}
          direction={'down'}
        />
      )}
      {account && (
        <DashedFakeButton
          onClick={() =>
            account &&
            show({ modalType: 'cdpcreate', modalTemplate: 'fullscreen' })
          }
          justifyContent="center"
          borderRadius="4px"
          py="s"
        >
          <Plus />
        </DashedFakeButton>
      )}
    </Fragment>
  ) : null;
});

export default CDPList;
