import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink, NavRoute } from 'react-navi';
import cdpTypesConfig from 'references/cdpTypes';

import MakerLogo from '../images/maker.svg';
import { ReactComponent as MakerSmall } from '../images/maker-small.svg';

const shownCDPTypes = cdpTypesConfig.filter(({ hidden }) => !hidden);

const StyledMakerLogo = styled.div`
  display: block;
  cursor: pointer;
  width: 33px;
  height: 21px;
  background: url(${MakerLogo}) center no-repeat;
  margin: 23px auto 32px;
  background-size: 33px;
`;

const StyledNavbar = styled.div`
  grid-area: navbar;
  background: #222;
`;

const NavbarItemContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: 66px;
  height: 54px;
  margin: 0 auto;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  ${({ active }) =>
    active
      ? css`
          background: #1aab9b;
          color: #f8f8f8;
          svg {
            opacity: 1;
          }
        `
      : css`
          background: #383838;
          color: #727272;
          svg {
            opacity: 0.3;
          }
        `};
  &:active {
    background: #1aab9b !important;
    color: #f8f8f8 !important;
    svg {
      opacity: 1 !important;
    }
  }
`;

const LogoWrap = styled.div`
  width: 100%;
  height: 18px;
  margin-bottom: 5px;
`;

const DelegateStyle = styled.div`
  &:active > a:not(:active) {
    background: #383838 !important;
    color: #727272 !important;
    svg {
      opacity: 0.3 !important;
    }
  }
`;

function CDPListView({ currentPath, currentSearch }) {
  return (
    <DelegateStyle>
      <NavbarItem
        key="overview"
        href={`/overview/${currentSearch}`}
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
            href={linkPath + currentSearch}
            label={cdp.symbol}
            Logo={cdp.logo}
            active={active}
          />
        );
      })}
    </DelegateStyle>
  );
}

function CDPList() {
  return (
    <NavRoute>
      {({ url }) => (
        <CDPListView currentPath={url.pathname} currentSearch={url.search} />
      )}
    </NavRoute>
  );
}

const NavbarItem = ({ href, label, Logo, active, ...props }) => (
  <NavbarItemContainer href={href} active={active} precache={true} {...props}>
    <div>
      <LogoWrap>
        <Logo />
      </LogoWrap>
      <span>{label}</span>
    </div>
  </NavbarItemContainer>
);

const Navbar = ({ ...props }) => (
  <StyledNavbar {...props}>
    <NavLink href="/" precache={true}>
      <StyledMakerLogo />
    </NavLink>
    <CDPList />
  </StyledNavbar>
);

export default Navbar;
