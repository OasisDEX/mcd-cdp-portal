import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import cdpTypesConfig from 'references/cdpTypes';
import { ReactComponent as MakerSmall } from '../images/maker-small.svg';
import { Flex, Text } from '@makerdao/ui-components-core';
import RatioDisplay from './RatioDisplay';
import { NavLink, NavRoute } from 'react-navi';

const _shownCDPTypes = cdpTypesConfig.filter(({ hidden }) => !hidden);
const shownCDPTypes = _shownCDPTypes.map(cdpType => ({
  ...cdpType,
  ratio: (Math.random() * 1000).toFixed(2)
}));

const DelegateStyle = styled.div`
  &:active > a:not(:active) {
    background: #383838 !important;
    svg {
      opacity: 0.3 !important;
    }
  }
`;
const NavbarItemContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: center;
  width: 66px;
  height: 54px;
  margin: 0 auto;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  color: #f8f8f8;
  ${({ active }) =>
    active
      ? css`
          background: #1aab9b;
          svg {
            opacity: 1;
          }
        `
      : css`
          background: #383838;
          svg {
            opacity: 0.3;
          }
        `};
  &:active {
    background: #1aab9b !important;
    svg {
      opacity: 1 !important;
    }
  }
`;

const NavbarItem = ({ href, label, ratio, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} precache={true} {...props}>
    <Flex flexDirection="column" lineHeight="17px">
      <Text>{label}</Text>
      <RatioDisplay ratio={ratio} />
    </Flex>
  </NavbarItemContainer>
);

const CDPList = memo(function({ currentPath, currentQuery }) {
  return (
    <DelegateStyle>
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
    </DelegateStyle>
  );
});

export default CDPList;
