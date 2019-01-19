import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-navi';

import MakerLogo from '../images/maker.svg';
import { ReactComponent as MakerSmall } from '../images/maker-small.svg';

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

const activeItemStyle = css`
  background: #1aab9b;
  color: #f8f8f8;
  svg {
    opacity: 1;
  }
`;

const inactiveItemStyle = css`
  background: #383838;
  color: #727272;
  svg {
    opacity: 0.3;
  }
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
  ${props => (props.active ? activeItemStyle : inactiveItemStyle)};
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
  &:active > * {
    ${inactiveItemStyle}
  }
`;

function CDPListView({ cdps }) {
  return (
    <DelegateStyle>
      <NavbarItem
        key="overview"
        href="/overview"
        label="Overview"
        Logo={MakerSmall}
      />
      {cdps.map((cdp, idx) => (
        <NavbarItem
          key={idx}
          href={`/cdp/${cdp.slug}`}
          label={cdp.symbol}
          Logo={cdp.logo}
        />
      ))}
    </DelegateStyle>
  );
}

function CDPList({ cdps }) {
  return <CDPListView cdps={cdps} />;
}

const NavbarItem = ({ href, label, Logo, ...props }) => (
  <NavbarItemContainer
    href={href}
    exact={false}
    activeStyle={{
      background: '#1aab9b !important',
      color: '#f8f8f8 !important'
    }}
    precache={true}
    {...props}
  >
    <div>
      <LogoWrap>
        <Logo />
      </LogoWrap>
      <span>{label}</span>
    </div>
  </NavbarItemContainer>
);

const Navbar = ({ cdps, ...props }) => (
  <StyledNavbar {...props}>
    <NavLink href="/">
      <StyledMakerLogo />
    </NavLink>
    <CDPList cdps={cdps} />
  </StyledNavbar>
);

export default Navbar;
