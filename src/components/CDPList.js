import React, { memo, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
// import { ReactComponent as MakerSmall } from '../images/maker-small.svg';
import { ReactComponent as Plus } from '../images/plus.svg';
import { Flex, Text } from '@makerdao/ui-components-core';
import RatioDisplay from './RatioDisplay';
import { Link } from 'react-navi';
import useModal from 'hooks/useModal';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import { trackCdpById } from 'reducers/multicall/cdps';
import getCdpData from '../reducers/selectors/getCdpData';
import round from 'lodash/round';

const NavbarItemContainer = styled(Link)`
  display: block;
`;

const DashedFakeButton = styled(Flex)`
  border: 1px dashed;
  cursor: pointer;
  border-color: ${({ theme }) => theme.colors.blackLighter};
`;

const NavbarItem = ({ href, label, ratio, owned, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} prefetch={true} {...props}>
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={active ? 'teal.500' : owned ? 'blackLighter' : 'grey.200'}
      borderRadius="default"
      height="50px"
    >
      <Text t="p6" fontWeight="bold" color={owned ? 'white' : 'darkPurple'}>
        {label}
      </Text>
      <RatioDisplay ratio={ratio} active={active} />
    </Flex>
  </NavbarItemContainer>
);

const CDPList = memo(function({ currentPath, viewedAddress, currentQuery }) {
  const { maker, account } = useMaker();
  const [{ urns, ilks }, dispatch] = useStore();
  const [ratios, setRatios] = useState([]);
  const [navbarCdps, setNavbarCdps] = useState([]);

  useEffect(() => {
    if (account) {
      account.cdps.forEach(cdp => trackCdpById(maker, cdp.id, dispatch));
      setNavbarCdps(account.cdps);
    } else if (viewedAddress) {
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
  }, [maker, account, viewedAddress, dispatch]);

  useEffect(() => {
    if (account || viewedAddress) {
      const ratios = navbarCdps.map(({ id }) => {
        const cdp = getCdpData(id, { urns, ilks });
        return cdp
          ? (cdp.collateralizationRatio.toNumber() * 100).toFixed(0)
          : '';
      });
      setRatios(ratios);
    }
  }, [account, navbarCdps, urns, ilks, viewedAddress]);

  const { show } = useModal();

  return (
    <Fragment>
      {/* <NavbarItem
        key="overview"
        href={`/owner/${currentQuery}`}
        label="Overview"
        active={currentPath.includes('/overview/')}
      /> */}
      {navbarCdps.map((cdp, idx) => {
        const ratio = ratios[idx] ? round(ratios[idx], 0) : null;
        const linkPath = `/${cdp.id}`;
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
      {!account ? null : (
        <DashedFakeButton
          onClick={() =>
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
  );
});

export default CDPList;
