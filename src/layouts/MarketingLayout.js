import React from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import { Helmet } from 'react-helmet';
import { Link } from 'react-navi';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';
import CookieNotice from '../components/CookieNotice';
import { hot } from 'react-hot-loader/root';
import { getColor, marketingTheme } from 'styles/theme';
import { Box } from '@makerdao/ui-components-core';
import { OasisLogoLink } from 'components/Marketing';

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

const Header = styled.header`
  ${centerContent};
  text-align: left;
  letter-spacing: 0.3px;

  .logo {
    font-size: 22px;
    line-height: 26px;
    font-weight: bold;
  }

  a {
    color: ${getColor('purpleGray')};
  }
`;

const Nav = styled(Box)`
  float: right;
  display: flex;
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
  font-size: 19px;
  margin-top: 4px;
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
    <MainNavStyle display={{ s: 'none', l: 'flex' }} {...props}>
      <Link href={`/${Routes.TRADE}`}>{lang.navbar.trade}</Link>
      <Link href={`/${Routes.BORROW}`}>{lang.navbar.borrow}</Link>
      <Link href={`/${Routes.SAVE}`}>{lang.navbar.save}</Link>
    </MainNavStyle>
  );
};

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

  ${Nav} {
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
const MarketingLayout = ({ children }) => {
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
          <MainNav />
        </Header>
        {children}
        <CookieNotice />
        <Footer>
          <Nav>
            <Link href={`/${Routes.PRIVACY}`}>{lang.navbar.privacy}</Link>
            <Link href={`/${Routes.TERMS}`}>{lang.navbar.terms}</Link>
          </Nav>
          <div className="copyright">
            © {new Date().getFullYear()} Maker Ecosystem Growth Holdings, Inc.
          </div>
        </Footer>
      </MarketingLayoutStyle>
    </ThemeProvider>
  );
};

export default hot(MarketingLayout);
