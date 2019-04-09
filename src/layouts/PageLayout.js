import React from 'react';
import styled from 'styled-components';
import useMaker from 'hooks/useMaker';
import { getColor } from 'styles/theme';
import { hot } from 'react-hot-loader/root';
import SidebarBase from 'components/SidebarBase';
import { mediaQueries } from 'styles/constants';
const breakpoint = mediaQueries.m.min;

const ResponsiveWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.backgroundGrey};

  ${breakpoint} {
    display: grid;
    grid-template-columns: ${({ theme }) =>
      [
        theme.measurement.navbarWidth,
        '1fr',
        theme.measurement.sidebarWidth
      ].join(' ')};
    grid-template-areas: 'navbar view sidebar';
  }
`;

const SidebarWrap = styled.div`
  display: none;
  min-height: 1000px;
  ${breakpoint} {
    display: block;
  }
`;

const NavbarWrap = styled.div`
  display: none;
  grid-area: navbar;
  background: ${({ theme, bgOverwrite }) => bgOverwrite || theme.colors.white};
  padding: 0 ${({ theme }) => theme.space.xs};

  ${breakpoint} {
    display: block;
  }
`;

const MobileNavWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  background: #222;
  height: 80px;
  padding: 15px;

  ${breakpoint} {
    display: none;
  }
`;

const ResponsivePageLayout = ({ mobileNav, navbar, children }) => {
  const { account } = useMaker();

  return (
    <ResponsiveWrap>
      <MobileNavWrap>{mobileNav}</MobileNavWrap>
      <NavbarWrap bgOverwrite={account ? getColor('black5') : null}>
        {navbar}
      </NavbarWrap>
      {children}
      <SidebarWrap>
        <SidebarBase />
      </SidebarWrap>
    </ResponsiveWrap>
  );
};

export default hot(ResponsivePageLayout);
