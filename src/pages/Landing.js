import React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { Link, useCurrentRoute } from 'react-navi';

import OasisLayout from 'layouts/OasisLayout';
import SEO from 'components/SEO';
import Questions from 'components/Questions';
import mixpanel from 'mixpanel-browser';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';

import { ReactComponent as BatIcon } from '../images/oasis-tokens/bat.svg';
import { ReactComponent as ZrxIcon } from '../images/oasis-tokens/zrx.svg';
import { ReactComponent as EthIcon } from '../images/oasis-tokens/eth.svg';
import { ReactComponent as DaiIcon } from '../images/oasis-tokens/dai.svg';
import { ReactComponent as RepIcon } from '../images/oasis-tokens/rep.svg';
import { ReactComponent as UsdcIcon } from '../images/oasis-tokens/usdc.svg';

const Hero = styled.div`
  color: #1e2e3a;
  font-size: 38px;
  margin-top: 97px;
`;

const Cards = styled.div`
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 80px auto;

  @media (max-width: 1020px) {
    max-width: 300px;
  }
`;

const Card = styled.div`
  overflow: hidden;
  border-radius: 15px;
  width: 300px;
  height: 355px;
  color: #ffffff;
  position: relative;
  flex-shrink: 1;

  @media (max-width: 1020px) {
    margin-bottom: 35px;
  }

  .title {
    font-size: 29px;
    margin-top: 56px;
  }

  .description {
    font-size: 17px;
    margin-top: 25px;
    margin-right: 23px;
    margin-left: 23px;
    line-height: 26px;
  }

  .buttonContainer {
    position: absolute;
    bottom: 32px;
    width: 100%;
  }

  .button {
    padding-right: 22px;
    padding-left: 22px;
    border-radius: 6px;
    display: inline-block;
    font-size: 15px;
    font-weight: 500;
    height: 39px;
    line-height: 38px;
    text-decoration: none;
  }

  .button.enabled {
    box-shadow: 0 2px 2px ${props => props.btnShadowColor};
    transition: all 0.15s ease;
  }

  .button.enabled:hover {
    box-shadow: 0 5px 5px ${props => props.btnShadowColor};
    transform: translateY(-1px);
  }
`;

const TextSection = styled.div`
  margin-top: 81px;

  h3 {
    font-size: 30px;
    font-weight: normal;
    margin-bottom: 20px;
    line-height: 40px;
    color: #000;
  }

  p {
    max-width: 580px;
    margin: 0 auto;
    font-size: 20px;
    line-height: 30px;
  }
`;

const tokens = [
  {
    name: 'Dai',
    icon: DaiIcon
  },
  {
    name: 'Ethereum',
    icon: EthIcon
  },
  {
    name: 'Augur*',
    icon: RepIcon
  },
  {
    name: '0x*',
    icon: ZrxIcon
  },
  {
    name: 'Basic Attention Token',
    icon: BatIcon
  },
  {
    name: 'USDC',
    icon: UsdcIcon
  }
];

const TokenList = styled.div`
  max-width: 700px;
  display: flex;
  justify-content: center;
  align-content: space-between;
  flex-wrap: wrap;
  margin: 22px auto 0;

  @media (max-width: 1000px) {
    max-width: 560px;
  }
`;

const Token = ({ name, icon }) => {
  const Icon = icon;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '38px 35px 22px'
      }}
    >
      <Icon width="22" height="22" style={{ flexGrow: 0, flexShrink: 0 }} />
      <span
        style={{
          fontSize: '17px',
          lineHeight: '22px',
          marginLeft: '13px',
          flexGrow: 0,
          flexShrink: 0
        }}
      >
        {name}
      </span>
    </div>
  );
};

function Landing() {
  const { url } = useCurrentRoute();
  const { lang } = useLanguage();

  return (
    <OasisLayout>
      <SEO title="Oasis" />
      <Hero>{lang.landing_page.headline}</Hero>
      <Cards>
        <Card
          style={{
            background:
              'linear-gradient(180deg, #C2D7E4 0%, #DBF1EC 100%), #7AAAC5'
          }}
          btnShadowColor="#c8e4e6"
        >
          <div className="title" style={{ color: '#253A44' }}>
            {lang.landing_page.trade_card.title}
          </div>
          <div className="description" style={{ color: '#14303A' }}>
            {lang.landing_page.trade_card.description}
          </div>
          <div className="buttonContainer">
            <a
              href="/trade"
              className="button enabled"
              style={{
                color: '#5894B5',
                backgroundColor: 'white'
              }}
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'StartTrading',
                  product: 'oasis-landing'
                });
              }}
            >
              {lang.landing_page.trade_card.button}
            </a>
          </div>
        </Card>
        <Card
          style={{
            background:
              'linear-gradient(180deg, #F0DED8 0%, #FDF2E1 100%), linear-gradient(0deg, #EFBF98, #EFBF98)'
          }}
          btnShadowColor="#F1E3DB"
        >
          <div className="title" style={{ color: '#5B2E1B' }}>
            {lang.landing_page.borrow_card.title}
          </div>
          <div className="description" style={{ color: '#5B2E1B' }}>
            {lang.landing_page.borrow_card.description}
          </div>
          <div className="buttonContainer">
            <div className="button">
              <Link
                href={`/${Routes.BORROW}${url.search}`}
                prefetch={true}
                className="button enabled"
                style={{
                  color: '#945F47',
                  backgroundColor: 'white'
                }}
                onClick={() => {
                  mixpanel.track('btn-click', {
                    id: 'BorrowDai',
                    product: 'oasis-landing'
                  });
                }}
              >
                {lang.landing_page.borrow_card.button}
              </Link>
            </div>
          </div>
        </Card>
        <Card
          style={{
            background: 'linear-gradient(180deg, #D5E8E3 0%, #EEF0E4 100%)',
            marginBottom: 0
          }}
          btnShadowColor="#D7E9E3"
        >
          <div className="title" style={{ color: '#002F28' }}>
            {lang.landing_page.save_card.title}
          </div>
          <div className="description" style={{ color: '#002F28' }}>
            {lang.landing_page.save_card.description}
          </div>
          <div className="buttonContainer">
            <div className="button">
              <Link
                href={`/${Routes.SAVE}${url.search}`}
                prefetch={true}
                className="button enabled"
                style={{
                  color: '#699C90',
                  backgroundColor: 'white'
                }}
                onClick={() => {
                  mixpanel.track('btn-click', {
                    id: 'SaveDai',
                    product: 'oasis-landing'
                  });
                }}
              >
                {lang.landing_page.save_card.button}
              </Link>
            </div>
          </div>
        </Card>
      </Cards>
      <TextSection style={{ marginTop: '103px' }}>
        <h3>{lang.landing_page.token_section_title}</h3>
        <TokenList>
          {tokens.map(({ name, icon }) => (
            <Token name={name} icon={icon} key={name} />
          ))}
        </TokenList>
        <span style={{ fontSize: '10px' }}>
          {lang.landing_page.token_section_only_on_trade}
        </span>
      </TextSection>
      <TextSection style={{ marginTop: '95px' }}>
        <h3>{lang.landing_page.section1_title}</h3>
        <p>{lang.landing_page.section1_p}</p>
      </TextSection>
      <TextSection>
        <h3>{lang.landing_page.section2_title}</h3>
        <p>{lang.landing_page.section2_p}</p>
      </TextSection>
      <TextSection>
        <h3>{lang.landing_page.section3_title}</h3>
        <p>{lang.landing_page.section3_p}</p>
      </TextSection>
      <TextSection>
        <h3>{lang.landing_page.questions_title}</h3>
        <Questions />
      </TextSection>
    </OasisLayout>
  );
}

export default hot(Landing);
