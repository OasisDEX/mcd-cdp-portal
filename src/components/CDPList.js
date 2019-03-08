import React, { memo, Fragment } from 'react';
import styled from 'styled-components';
import cdpTypesConfig from 'references/cdpTypes';
import { ReactComponent as MakerSmall } from '../images/maker-small.svg';
import { Flex } from '@makerdao/ui-components-core';
import RatioDisplay from './RatioDisplay';
import { NavLink } from 'react-navi';
import { NavLabel } from 'components/Typography';
const _shownCDPTypes = cdpTypesConfig.filter(({ hidden }) => !hidden);

const shownCDPTypes = _shownCDPTypes.map(cdpType => ({
  ...cdpType,
  ratio: (Math.random() * 1000).toFixed(2)
}));

const NavbarItemContainer = styled(NavLink)`
  display: block;
`;

const NavbarItem = ({ href, label, ratio, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} precache={true} {...props}>
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={active ? 'greenPastel' : 'blackLight'}
      borderRadius="4px"
      height="50px"
    >
      <NavLabel t="p6">{label}</NavLabel>
      <RatioDisplay ratio={ratio} active={active} />
    </Flex>
  </NavbarItemContainer>
);

const CDPList = memo(function({ currentPath, currentQuery }) {
  return (
    <Fragment>
      <NavbarItem
        key="overview"
        href={`/overview/${currentQuery}`}
        label="Overview"
        Logo={MakerSmall}
        active={currentPath.includes('/overview/')}
      />
      {shownCDPTypes.map((cdp, idx) => {
        const linkPath = `/cdp/${cdp.slug}/`;
        const active = currentPath.includes(linkPath);
        return (
          <NavbarItem
            key={idx}
            href={linkPath + currentQuery}
            label={cdp.symbol}
            ratio={cdp.ratio}
            active={active}
            cdpKey={cdp.key}
          />
        );
      })}
    </Fragment>
  );
});

export default CDPList;
