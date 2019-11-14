import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Link } from 'react-navi';
import { ReactComponent as Cross } from '../images/cross2.svg';
import Cookies from 'js-cookie';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';

const OasisLayoutStyle = styled.div`
  /*! minireset.css v0.0.3 | MIT License | github.com/jgthms/minireset.css */
  p,
  ol,
  ul,
  li,
  dl,
  dt,
  dd,
  blockquote,
  figure,
  fieldset,
  legend,
  textarea,
  pre,
  iframe,
  hr,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 100%;
    font-weight: normal;
  }

  ul {
    list-style: none;
  }

  button,
  input,
  select,
  textarea {
    margin: 0;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  img,
  embed,
  iframe,
  object,
  audio,
  video {
    height: auto;
    max-width: 100%;
  }

  iframe {
    border: 0;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  td,
  th {
    padding: 0;
    text-align: left;
  }
  /* end minireset */

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  padding: 0 40px;
  font-family: 'FT Switch', Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: black;
  width: 100%;

  @media only screen and (max-width: 425px) {
    padding: 0 10px;
  }

  a {
    color: black;
    text-decoration: none;
  }
`;

const Header = styled.header`
  text-align: left;

  .logo {
    font-size: 21px;
    line-height: 25px;
    letter-spacing: 0.3px;
    font-weight: 500;
  }
`;

const CookieNoticeStyle = styled.div`
  background: #ffffff;
  border: 1px solid #d4d9e1;
  box-sizing: border-box;
  box-shadow: 0 1px 2px rgba(90, 90, 90, 0.06);
  border-radius: 90px;
  text-align: left;
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);

  z-index: 3000;
  padding: 8px 18px 10px;
  white-space: nowrap;

  @media (max-width: 415px) {
    bottom: 0;
    border-radius: unset;
    white-space: normal;
    width: 100%;
  }

  a {
    color: #447afb;
    transition: color 0.2s;
  }

  a:hover {
    color: #2c4e9c;
  }
`;

const CookieNotice = () => {
  const OASIS_APP_PRIVACY_ACCEPTED_DATE = 'oasis_app_privacy_accepted_date';
  const [show, setShow] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const acceptedDate = Cookies.get(OASIS_APP_PRIVACY_ACCEPTED_DATE);
    if (!acceptedDate) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    Cookies.set(OASIS_APP_PRIVACY_ACCEPTED_DATE, new Date().toISOString(), {
      expires: 365
    });
    setShow(false);
  };

  return (
    <CookieNoticeStyle style={{ display: show ? 'block' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: '#231536', flexShrink: 1 }}>
          {lang.formatString(
            lang.cookie_notice,
            <Link href={`/${Routes.PRIVACY}`}>{lang.privacy_policy}</Link>
          )}
        </span>
        <div style={{ width: '10px' }} />
        <Cross
          onClick={handleClose}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        />
      </div>
    </CookieNoticeStyle>
  );
};

const centerFooterMaxWidth = '640px';

const Footer = styled.footer`
  margin-top: 90px;
  margin-bottom: 70px;

  *,
  *:before,
  *:after {
    position: static;
  }

  nav {
    float: right;
    display: flex;
    justify-content: center;

    @media (max-width: ${centerFooterMaxWidth}) {
      float: none;
    }

    a {
      font-size: 17px;
      text-decoration: none;
      color: black;
    }

    a:hover {
      color: #6d6d6d;
    }

    a:not(:first-child) {
      margin-left: 64px;
    }
  }

  .copyright {
    text-align: left;
    font-size: 16px;
    letter-spacing: 0.3px;
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

const OasisLayout = ({ children }) => {
  const { lang } = useLanguage();
  return (
    <OasisLayoutStyle>
      <div
        style={{
          margin: '0 auto',
          maxWidth: 1203,
          paddingTop: '41px',
          width: '100%'
        }}
      >
        <Helmet>
          <link
            rel="preload"
            as="font"
            href="/fonts/FTSwitch-Regular.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTSwitch-Regular.woff"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTSwitch-Medium.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTSwitch-Medium.woff"
            type="font/woff"
            crossOrigin="anonymous"
          />
        </Helmet>
        <Header>
          <Link className="logo" href="/">
            Oasis
          </Link>
        </Header>
        {children}
        <CookieNotice/>
        <Footer>
          <nav>
            <Link href={`/${Routes.PRIVACY}`}>{lang.navbar.privacy}</Link>
            <Link href={`/${Routes.TERMS}`}>{lang.navbar.terms}</Link>
          </nav>
          <div className="copyright">
            © {new Date().getFullYear()} Maker Ecosystem Growth Holdings, Inc.
          </div>
        </Footer>
      </div>
    </OasisLayoutStyle>
  );
};

export default OasisLayout;
