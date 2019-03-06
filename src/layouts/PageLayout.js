import React from 'react';
import styled from 'styled-components';

import { mediaQueries } from 'styles/constants';
const breakpoint = mediaQueries.m.min;

const ResponsiveWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundGrey};

  ${breakpoint} {
    display: grid;
    grid-template-columns: 80px 1fr 315px;
    grid-template-areas: 'navbar view sidebar';
  }
`;

const SidebarWrap = styled.div`
  display: none;
  min-height: 1000px;
  background: #fff;
  box-shadow: -1px 0px 3px rgba(159, 159, 159, 0.25);

  ${breakpoint} {
    display: block;
  }
`;

const NavbarWrap = styled.div`
  display: none;
  grid-area: navbar;
  background: #222;
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

const ResponsivePageLayout = ({ mobileNav, navbar, sidebar, content }) => (
  <ResponsiveWrap>
    <MobileNavWrap>{mobileNav}</MobileNavWrap>
    <NavbarWrap>{navbar}</NavbarWrap>
    {content}
    <SidebarWrap>{sidebar}</SidebarWrap>
  </ResponsiveWrap>
);

export default ResponsivePageLayout;
