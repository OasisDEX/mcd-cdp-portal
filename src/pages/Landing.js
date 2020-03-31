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
import { Box, Text } from '@makerdao/ui-components-core';

const Cards = styled.div`
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 80px auto;
  padding-bottom: 66px;

  :after {
    content: ' ';
    display: block;
    position: absolute;
    z-index: -1;
    bottom: 0;
    width: 93%;
    left: 3.5%;
    height: 95%;
    background: linear-gradient(
      180deg,
      rgba(255, 249, 237, 0) 0%,
      #fff9ed 100%
    );
  }

  @media (max-width: 1238px) {
    max-width: 368px;
    :after {
      content: none;
    }
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

  @media (max-width: 1238px) {
    margin-bottom: 35px;
  }

  .title {
    font-size: 28px;
    line-height: 28px;
    margin-top: 21px;
    margin-bottom: 13px;
    font-weight: bold;
    color: ${getColor('darkPurple')};
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

      color: #ffffff;
      text-decoration: none;
    }
  }

  .button:hover {
    transform: translateY(-1px);
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
    name: 'BAT',
    icon: BatIcon
  },
  {
    name: 'Augur',
    icon: RepIcon,
    onlyOnTrade: true
  },
  {
    name: 'USDC',
    icon: UsdcIcon
  },
  {
    name: '0x',
    icon: ZrxIcon,
    onlyOnTrade: true
  }
];

const TokenList = styled.div`
  max-width: 1170px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 74px auto 69px;
`;

const TokenStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;

  svg {
    flex-grow: 0;
    flex-shrink: 0;
  }

  svg {
    width: 70px;
  }

  span {
    margin-top: 28px;
    font-size: 22px;
    letter-spacing: 0.5px;
    color: ${getColor('darkPurple')};
    position: relative;
  }

  span.onlyOnTrade:after {
    font-family: 'Arial Hebrew', Arial, sans-serif;
    content: '*';
    font-size: 34px;
    position: absolute;
    top: 1rem;
    line-height: 20px;
  }
`;

const Token = ({ config: { name, icon, onlyOnTrade } }) => {
  const Icon = icon;
  return (
    <TokenStyle>
      <Icon />
      <span className={onlyOnTrade ? 'onlyOnTrade' : ''}>{name}</span>
    </TokenStyle>
  );
};

const BlurryBackground = (() => {
  const BallTop = styled.div`
    position: absolute;
    width: 206px;
    height: 206px;
    top: -45px;
    left: 130px;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #eaffcf 0%,
      #fedb88 100%
    );
    filter: blur(60px);
  `;

  const BallRight = styled.div`
    position: absolute;
    width: 83px;
    height: 83px;
    top: 619px;
    left: 1209px;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #d2ff72 0%,
      #fdc134 100%
    );
    filter: blur(30px);
  `;

  const BlurryBackgroundStyle = styled.div`
    position: absolute;
    top: -25px;
    width: 100%;
    height: 91%;
    background: radial-gradient(
      99.92% 100% at 40.9% 100%,
      #f7fce7 0%,
      #fff9ed 54.69%,
      rgba(255, 249, 237, 0) 100%
    );
    z-index: -1;

    & > div {
      position: relative;
      max-width: 1440px;
      margin: 0 auto;
    }
  `;

  return props => (
    <BlurryBackgroundStyle {...props}>
      <div>
        <BallTop />
        <BallRight />
      </div>
    </BlurryBackgroundStyle>
  );
})();

const JumboBlock = styled(Box)`
  max-width: 966px;
  background: radial-gradient(100% 100% at 0% 0%, #f4ffec 0%, #fef4db 100%);
  text-align: left;
  margin: 0 auto;
  padding: 10px 130px 122px 120px;

  & > div {
    margin-top: 121px;
  }

  .title {
    margin-bottom: 23px;
  }
`;

function Landing() {
  const { url } = useCurrentRoute();
  const { lang } = useLanguage();

  return (
    <MarketingLayout>
      <SEO title="Oasis" />
      <Box mt="149px">
        <Text t="h1">{lang.landing_page.headline}</Text>
      </Box>
      <Cards>
        <Card
          style={{
            background:
              'radial-gradient(111.67% 100% at 0% 0%, #F2FFE6 0%, #C6FFF9 100%)'
          }}
        >
          <TradeIcon />
          <h1 className="title">{lang.landing_page.trade_card.title}</h1>
          <Text t="body">{lang.landing_page.trade_card.description}</Text>
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
          <Text t="body">{lang.landing_page.borrow_card.description}</Text>
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
          <Text t="body">{lang.landing_page.save_card.description}</Text>
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
      <Box style={{ marginTop: '103px' }}>
        <Text t="h2">{lang.landing_page.token_section_title}</Text>
        <TokenList>
          {tokens.map(config => (
            <Token config={config} key={config.name} />
          ))}
        </TokenList>
        <span
          style={{
            fontSize: '18px',
            letterSpacing: '0.5px',
            color: '#4F445E',
            position: 'relative'
          }}
        >
          <span
            style={{ fontSize: '2.6rem', position: 'relative', top: '5px' }}
          >
            *
          </span>{' '}
          {lang.landing_page.token_section_only_on_trade}
        </span>
      </Box>
      <Box style={{ position: 'relative', width: '100%', marginTop: '95px' }}>
        <BlurryBackground />
        <JumboBlock>
          <div>
            <Text t="h3" className="title">
              {lang.landing_page.section1_title}
            </Text>
            <Text t="body">{lang.landing_page.section1_p}</Text>
          </div>
          <div>
            <Text t="h3" className="title">
              {lang.landing_page.section2_title}
            </Text>
            <Text t="body">{lang.landing_page.section2_p}</Text>
          </div>
          <div>
            <Text t="h3" className="title">
              {lang.landing_page.section3_title}
            </Text>
            <Text t="body">{lang.landing_page.section3_p}</Text>
          </div>
        </JumboBlock>
      </Box>
      <Box>
        <Text t="h2">{lang.landing_page.questions_title}</Text>
        <Questions
          questions={buildQuestionsFromLangObj(lang.landing_page, lang)}
        />
      </Box>
    </MarketingLayout>
  );
}

export default hot(Landing);
