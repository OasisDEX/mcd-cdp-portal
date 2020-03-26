import React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { Link, useCurrentRoute } from 'react-navi';

import MarketingLayout from 'layouts/MarketingLayout';
import SEO from 'components/SEO';
import Questions, { buildQuestionsFromLangObj } from 'components/Questions';
import mixpanel from 'mixpanel-browser';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';
import { getColor } from 'styles/theme';

import { ReactComponent as TradeIcon } from 'images/landing/trade-icon.svg';
import { ReactComponent as BorrowIcon } from 'images/landing/borrow-icon.svg';
import { ReactComponent as SaveIcon } from 'images/landing/save-icon.svg';
import { ReactComponent as BatIcon } from 'images/oasis-tokens/bat.svg';
import { ReactComponent as ZrxIcon } from 'images/oasis-tokens/zrx.svg';
import { ReactComponent as EthIcon } from 'images/oasis-tokens/eth.svg';
import { ReactComponent as DaiIcon } from 'images/oasis-tokens/dai.svg';
import { ReactComponent as RepIcon } from 'images/oasis-tokens/rep.svg';
import { ReactComponent as UsdcIcon } from 'images/oasis-tokens/usdc.svg';

const Hero = styled.div`
  color: ${getColor('darkPurple')};
  font-weight: bold;
  font-size: 58px;
  margin-top: 149px;
`;

const Cards = styled.div`
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 80px auto;

  @media (max-width: 1238px) {
    max-width: 368px;
  }
`;

const Card = styled.div`
  overflow: hidden;
  width: 368px;
  height: 430px;
  position: relative;
  flex-shrink: 1;
  text-align: left;
  padding: 57px 40px 60px;

  @media (max-width: 1020px) {
    margin-bottom: 35px;
  }

  .title {
    font-size: 28px;
    line-height: 28px;
    margin-top: 21px;
    margin-bottom: 13px;
    font-weight: bold;
  }

  .description {
    font-size: 22px;
    line-height: 34px;
    letter-spacing: 0.5px;
    color: {getColor('violetGray')};
  }

  .buttonContainer {
    position: absolute;
    bottom: 59px;
    width: 100%;
  }

  .button {
    display: inline-flex;
    padding: 12px 24px;
    border-radius: 40px;
    background-color: ${getColor('darkPurple')};
    
    transition: all 0.15s ease;
    
    span {
      align-self: center;
      
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0.5px;
  
      color: #FFFFFF;
      text-decoration: none;
    }
    
  }

  .button:hover {
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
      <Icon style={{ flexGrow: 0, flexShrink: 0 }} />
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
    <MarketingLayout>
      <SEO title="Oasis" />
      <Hero>{lang.landing_page.headline}</Hero>
      <Cards>
        <Card
          style={{
            background:
              'radial-gradient(111.67% 100% at 0% 0%, #F2FFE6 0%, #C6FFF9 100%)'
          }}
        >
          <TradeIcon />
          <h1 className="title">{lang.landing_page.trade_card.title}</h1>
          <div className="description">
            {lang.landing_page.trade_card.description}
          </div>
          <div className="buttonContainer">
            <Link
              href={`/${Routes.TRADE}`}
              className="button"
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'StartTrading',
                  product: 'oasis-landing'
                });
              }}
            >
              <span>{lang.landing_page.trade_card.button}</span>
            </Link>
          </div>
        </Card>
        <Card
          style={{
            background:
              'radial-gradient(100% 100% at 0% 0%, #E2FFCC 0%, #FFF1CF 100%)'
          }}
        >
          <BorrowIcon />
          <h1 className="title">{lang.landing_page.borrow_card.title}</h1>
          <div className="description">
            {lang.landing_page.borrow_card.description}
          </div>
          <div className="buttonContainer">
            <Link
              href={`/${Routes.BORROW}${url.search}`}
              prefetch={true}
              className="button"
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'BorrowDai',
                  product: 'oasis-landing'
                });
              }}
            >
              <span>{lang.landing_page.borrow_card.button}</span>
            </Link>
          </div>
        </Card>
        <Card
          style={{
            background:
              'radial-gradient(100% 100% at 0% 0%, #FFE9E9 0%, #FFE9B5 100%)',
            marginBottom: 0
          }}
        >
          <SaveIcon />
          <h1 className="title">{lang.landing_page.save_card.title}</h1>
          <div className="description">
            {lang.landing_page.save_card.description}
          </div>
          <div className="buttonContainer">
            <Link
              href={`/${Routes.SAVE}${url.search}`}
              prefetch={true}
              className="button"
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'SaveDai',
                  product: 'oasis-landing'
                });
              }}
            >
              <span>{lang.landing_page.save_card.button}</span>
            </Link>
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
        <Questions
          questions={buildQuestionsFromLangObj(lang.landing_page, lang)}
        />
      </TextSection>
    </MarketingLayout>
  );
}

export default hot(Landing);
