import React, { memo, useEffect, useState, useRef } from 'react';
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
import { useSpring, animated } from 'react-spring';

const NavbarItemContainer = styled(Link)`
  display: block;
`;

const DashedFakeButton = styled(Flex)`
  cursor: pointer;
`;

const cdpListFill = '#18232C';
const activeFill = '#31424E';
const inactiveFill = '#18232C';
const itemHeight = '50px';

const OverviewButton = ({ href, label, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} prefetch={true} {...props}>
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={active ? activeFill : inactiveFill}
      borderRadius="default"
      height={itemHeight}
    >
      <Text t="p6" fontWeight="bold" color="white">
        {label}
      </Text>
    </Flex>
  </NavbarItemContainer>
);

const DirectionalButton = ({ direction, onClick }) => {
  return (
    <Flex
      onClick={() => onClick(direction)}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={inactiveFill}
      borderRadius="default"
      height="25px"
      css={`
        cursor: pointer;
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
      bg={active ? activeFill : owned ? inactiveFill : 'grey.200'}
      borderRadius="default"
      height="50px"
      mt="5px"
    >
      <Text t="p6" fontWeight="bold" color={owned ? 'white' : 'darkPurple'}>
        {label}
      </Text>
      <RatioDisplay fontSize="1.3rem" ratio={ratio} active={active} />
    </Flex>
  </NavbarItemContainer>
);

const CdpContainer = styled(Flex)`
  cursor: pointer;
  flex-direction: column;
  overflow: auto;
  height: ${props => (props.cdpsLength >= 4 ? '250px' : undefined)};
`;

// replace Fragment with this & add style={props}
// const AnimatedWrap = styled(animated.div)`
//   width: 100%;
// `;

const CDPList = memo(function({ currentPath, viewedAddress, currentQuery }) {
  const { url } = useCurrentRoute();
  const [listOpen, setListOpen] = useState(false);
  const { maker, account } = useMaker();
  const [{ cdps, feeds }, dispatch] = useStore();
  const [ratios, setRatios] = useState([]);
  const [navbarCdps, setNavbarCdps] = useState([]);
  const [overviewPath, setOverviewPath] = useState(currentPath);
  const active = currentPath === overviewPath;

  // const fadeProps = {
  //   to: { opacity: listOpen ? 1 : 0 },
  //   from: { opacity: listOpen ? 0 : 1 }
  // };
  // const [props, set, stop] = useSpring(
  //   () => console.log('animation render2', listOpen) || fadeProps
  // );

  useEffect(() => {
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

  const [scrollPosition, setScrollPosition] = useState(0);
  const cdpContainerRef = useRef(null);

  const onDirectionalClick = direction => {
    const scrollAmount = 50;
    const topPosition = 0;
    const bottomPosition = 570;
    let newPosition =
      direction === 'up' && scrollAmount
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;
    if (newPosition < topPosition) newPosition = topPosition;
    if (newPosition > bottomPosition) newPosition = bottomPosition;
    setScrollPosition(newPosition);
    cdpContainerRef.current.scrollTop = newPosition;
  };

  const { show } = useModal();
  const showDirectionals = navbarCdps.length >= 4;

  return listOpen ? (
    <Box bg={cdpListFill} height="100%">
      {showDirectionals && (
        <DirectionalButton onClick={onDirectionalClick} direction={'up'} />
      )}
      <CdpContainer ref={cdpContainerRef} cdpsLength={navbarCdps.length}>
        <OverviewButton
          key={navbarCdps.length * 10}
          href={overviewPath + currentQuery}
          label={'Overview'}
          active={active}
        />
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
      {showDirectionals && (
        <DirectionalButton onClick={onDirectionalClick} direction={'down'} />
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
    </Box>
  ) : null;
});

export default CDPList;
