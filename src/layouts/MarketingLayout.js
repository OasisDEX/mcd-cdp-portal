import React from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import { Helmet } from 'react-helmet';
import { Link } from 'react-navi';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';
import CookieNotice from '../components/CookieNotice';
import { hot } from 'react-hot-loader/root';
import { getColor, marketingTheme } from 'styles/theme';
import { Box, Flex } from '@makerdao/ui-components-core';
import { OasisLogoLink, SeparatorDot, Hamburger } from 'components/Marketing';

const MarketingLayoutStyle = styled.div`
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;

  padding-top: 32px;
  font-family: 'FT Base', Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: ${getColor('purpleGray')};
  width: 100%;
  overflow-x: hidden;

  a {
    color: ${getColor('darkPurple')};
    text-decoration: none;
  }
`;

const centerContent = css`
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 40px;

  @media only screen and (max-width: 425px) {
    padding: 0 10px;
  }
`;

const Nav = styled(Box)`
  display: ${props => props.display || 'inline-flex'};
  justify-content: center;
  font-size: 16px;

  a {
    text-decoration: none;
  }

  a:hover {
    color: #6d6d6d;
  }

  a:not(:first-child) {
    margin-left: ${props => props.separation || '56px'};
  }
`;

const MainNavStyle = styled(Nav)`
  font-size: ${props => props.fontSize || '19px'};

  a {
    color: ${getColor('violetGray')};
  }

  @media (max-width: 550px) {
    a:not(:first-child) {
      margin-left: 38px;
    }
  }

  @media (max-width: 425px) {
    a:not(:first-child) {
      margin-left: 20px;
    }
  }
`;

const MainNav = props => {
  const { lang } = useLanguage();

  return (
    <MainNavStyle {...props}>
      <Link href={`/${Routes.TRADE}`} activeStyle={{ fontWeight: 'bold' }}>
        {lang.navbar.trade}
      </Link>
      <Link href={`/${Routes.BORROW}`} activeStyle={{ fontWeight: 'bold' }}>
        {lang.navbar.borrow}
      </Link>
      <Link href={`/${Routes.SAVE}`} activeStyle={{ fontWeight: 'bold' }}>
        {lang.navbar.save}
      </Link>
    </MainNavStyle>
  );
};

const Header = styled.header`
  ${centerContent};
  text-align: left;
  letter-spacing: 0.3px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    font-size: 22px;
    line-height: 26px;
    font-weight: bold;
  }

  a {
    color: ${getColor('purpleGray')};
  }

  ${MainNavStyle} {
    display: none;
  }

  ${Hamburger} {
    display: block;
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    ${MainNavStyle} {
      display: inline-flex;
    }

    ${Hamburger} {
      display: none;
    }
  }
`;

const centerFooterMaxWidth = '640px';

const Footer = styled.footer`
  ${centerContent};
  margin-top: 90px;
  margin-bottom: 70px;
  letter-spacing: 0.3px;

  *,
  *:before,
  *:after {
    position: static;
  }

  .navs {
    display: inline-flex;
    align-items: center;
    float: right;
  }

  ${Nav} {
    float: none;
  }

  ${Nav}, .navs {
    @media (max-width: ${centerFooterMaxWidth}) {
      float: none;
    }
  }

  .copyright {
    text-align: left;
    font-size: 16px;
    white-space: nowrap;

    @media (max-width: ${centerFooterMaxWidth}) {
      padding-top: 60px;
      text-align: center;
    }

    @media (max-width: 425px) {
      font-size: 13px;
    }
  }
`;

// It has the Oasis logo, the top nav links, and the copyright notice.
const MarketingLayout = ({ showNavInFooter, children }) => {
  const { lang } = useLanguage();
  return (
    <ThemeProvider theme={marketingTheme}>
      <MarketingLayoutStyle>
        <Helmet>
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Regular.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Regular.woff"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Bold.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Bold.woff"
            type="font/woff"
            crossOrigin="anonymous"
          />
        </Helmet>
        <Header>
          <OasisLogoLink />
          <MainNav mt="4px" />
          <Hamburger />
        </Header>
        {children}
        <CookieNotice />
        <Footer>
          <div className="navs">
            {showNavInFooter && (
              <Flex
                display={{ s: 'none', xl: 'inline-flex' }}
                alignItems="center"
              >
                <MainNav fontSize="16px" separation="52px" />
                <SeparatorDot m="0 38px" />
              </Flex>
            )}
            <Nav>
              <Link href={`/${Routes.PRIVACY}`}>{lang.navbar.privacy}</Link>
              <Link href={`/${Routes.TERMS}`}>{lang.navbar.terms}</Link>
            </Nav>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} Maker Ecosystem Growth Holdings, Inc.
          </div>
        </Footer>
      </MarketingLayoutStyle>
    </ThemeProvider>
  );
};

export default hot(MarketingLayout);
