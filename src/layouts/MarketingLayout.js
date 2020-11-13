import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import { Helmet } from 'react-helmet';
import { Link, useNavigation } from 'react-navi';
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
  font-size: ${props => props.fontSize || '18px'};

  a {
    color: ${getColor('violetGray')};
  }
`;

const MainNav = ({ onLinkClicked, ...props }) => {
  const { lang } = useLanguage();
  const navigation = useNavigation();
  return (
    <MainNavStyle {...props}>
      <Link
        href={`${navigation.basename}/trade`}
        activeStyle={{ fontWeight: 'bold' }}
        onClick={() => onLinkClicked && onLinkClicked()}
      >
        {lang.navbar.trade}
      </Link>
      <Link
        href={`${navigation.basename}`}
        activeStyle={{ fontWeight: 'bold' }}
        onClick={() => onLinkClicked && onLinkClicked()}
      >
        {lang.navbar.borrow}
      </Link>
      <Link
        href={'https://oasis.app'}
        activeStyle={{ fontWeight: 'bold' }}
        onClick={() => onLinkClicked && onLinkClicked()}
      >
        {lang.navbar.save}
      </Link>
      <Link href="https://blog.oasis.app/">{lang.navbar.blog}</Link>
    </MainNavStyle>
  );
};

const centerContent = css`
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 24px;

  @media only screen and (min-width: ${props => props.theme.breakpoints.m}) {
    padding: 0 40px;
  }
`;

const Header = styled.header`
  ${centerContent};
  margin-top: 16px;
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
    margin-right: 3px;
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    margin-top: 32px;

    ${MainNavStyle} {
      display: inline-flex;
    }

    ${Hamburger} {
      display: none;
    }
  }
`;

const MobileMenu = styled(Box)`
  position: fixed;
  top: 43px;
  left: 0;
  width: 100vw;
  background-color: #fff;
  overflow-y: scroll;
  transition: all 0.2s ease-in-out;
  z-index: 99;

  ${MainNavStyle} {
    margin-top: 64px;
    flex-direction: column;
    align-items: flex-start;
    font-size: 26px;
    float: left;
    a:not(:first-child) {
      margin-left: 0;
      margin-top: 63px;
    }
  }

  ${OasisLogoLink} {
    display: block;
    text-align: left;
    font-size: 40px;
    line-height: 48px;
    letter-spacing: 0.3px;
  }
`;

const Footer = styled.footer`
  ${centerContent};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 90px;
  margin-bottom: 39px;
  letter-spacing: 0.3px;

  *,
  *:before,
  *:after {
    position: static;
  }

  .navs {
    display: inline-flex;
    align-items: center;
    float: none;
    text-align: center;
    flex-direction: column;
  }

  ${SeparatorDot} {
    display: none;
  }

  ${MainNavStyle} {
    margin-bottom: 24px;
  }

  .legal-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      max-width: 80px;
      &:not(:first-child) {
        margin-left: 44px;
      }
    }
  }

  .copyright {
    font-size: 13px;
    white-space: nowrap;
    padding-top: 48px;
    text-align: center;

    @media (min-width: 375px) {
      font-size: 16px;
    }
  }

  @media (min-width: 700px) {
    margin-bottom: 70px;

    ${SeparatorDot} {
      display: inline-block;
    }

    ${MainNavStyle} {
      margin-bottom: 0;
    }

    ${Nav}, .navs {
      text-align: center;
      flex-direction: row;
    }

    .legal-nav {
      a:not(:first-child) {
        margin-left: 56px;
      }
    }
  }

  @media (min-width: 1150px) {
    flex-direction: row-reverse;

    .copyright {
      text-align: left;
      padding-top: 0;
    }
  }
`;

// It has the Oasis logo, the top nav links, and the copyright notice.
// It also has a ThemeProvider
const MarketingLayout = ({
  showNavInFooter,
  extraLegalLinks = [],
  children
}) => {
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    };
  }, [mobileMenuOpen]);

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
            href="/fonts/FTBase-Medium.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Medium.woff"
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
        <Header className={mobileMenuOpen ? 'menu-open' : ''}>
          <OasisLogoLink
            style={{ visibility: mobileMenuOpen ? 'hidden' : 'visible' }}
          />
          <MainNav separation="67px" />
          <Hamburger
            active={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </Header>
        <MobileMenu
          opacity={mobileMenuOpen ? 1 : 0}
          height={mobileMenuOpen ? '100%' : '0'}
          display={{ s: 'block', m: 'none' }}
        >
          <Box p="39px 33px 33px">
            <Box display="inline-block" style={{ float: 'left' }}>
              <OasisLogoLink onClick={() => setMobileMenuOpen(false)} />
              <MainNav onLinkClicked={() => setMobileMenuOpen(false)} />
            </Box>
          </Box>
        </MobileMenu>
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
            <Nav className="legal-nav">
              <Link href={'https://oasis.app/privacy'}>
                {lang.navbar.privacy}
              </Link>
              <Link href={'https://oasis.app/terms'}>{lang.navbar.terms}</Link>
              {extraLegalLinks.map(link => (
                <Link
                  href={link.url}
                  key={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.text}
                </Link>
              ))}
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
