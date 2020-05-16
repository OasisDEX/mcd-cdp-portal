import React from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { Link, useCurrentRoute } from 'react-navi';

import MarketingLayout from 'layouts/MarketingLayout';
import SEO from 'components/SEO';
import {
  Questions,
  buildQuestionsFromLangObj,
  FullWidth,
  FadeIn,
  FilledButton
} from 'components/Marketing';
import mixpanel from 'mixpanel-browser';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';
import { getColor, marketingTheme } from 'styles/theme';

import { ReactComponent as TradeIcon } from 'images/landing/trade-icon.svg';
import { ReactComponent as BorrowIcon } from 'images/landing/borrow-icon.svg';
import { ReactComponent as SaveIcon } from 'images/landing/save-icon.svg';
import { Box, Grid, Text } from '@makerdao/ui-components-core';
import { ReactComponent as BatIcon } from '../images/oasis-tokens/bat.svg';
import { ReactComponent as ZrxIcon } from '../images/oasis-tokens/zrx.svg';
import { ReactComponent as EthIcon } from '../images/oasis-tokens/eth.svg';
import { ReactComponent as DaiIcon } from '../images/oasis-tokens/dai.svg';
import { ReactComponent as RepIcon } from '../images/oasis-tokens/rep.svg';
import { ReactComponent as UsdcIcon } from '../images/oasis-tokens/usdc.svg';
import { ReactComponent as LinkIcon } from '../images/oasis-tokens/link.svg';
import { ReactComponent as PaxIcon } from '../images/oasis-tokens/pax.svg';
import { ReactComponent as TusdIcon } from '../images/oasis-tokens/tusd.svg';
import { ReactComponent as WbtcIcon } from '../images/oasis-tokens/wbtc.svg';

const Content = ({ children }) => (
  <Box p={{ s: `0 ${marketingTheme.mobilePaddingX}`, l: '0 32px' }}>
    <Box maxWidth="1200px" mx="auto">
      {children}
    </Box>
  </Box>
);

const Cards = (() => {
  const CardsContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-right: auto;
    margin-left: auto;
    padding-bottom: 48px;

    :after {
      content: ' ';
      display: block;
      position: absolute;
      z-index: -1;
      bottom: 0;
      width: 93%;
      left: 3.5%;
      height: 91%;
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
    position: relative;
    flex-shrink: 1;
    text-align: left;
    padding: 64px 40px;

    @media (max-width: 1238px) {
      margin-bottom: 24px;
    }

    .title {
      font-size: 26px;
      line-height: 27px;
      margin-top: 21px;
      margin-bottom: 12px;
      font-weight: bold;
      color: ${getColor('darkPurple')};
    }

    .description {
      min-height: 98px;
      display: block;
    }

    .buttonContainer {
      margin-top: 18px;
      display: inline-block;
      transition: all 0.15s ease;
      padding-bottom: 0;
      cursor: pointer;
      :hover {
        margin-top: 16px;
        padding-bottom: 2px;

        ${FilledButton} {
          background-color: #50445e;
        }
      }
    }

    ${FilledButton} {
      display: inline-flex;
      padding: 12px 24px 13px;
      height: unset;
      line-height: 19px;
      text-decoration: none;
    }
  `;

  return props => {
    const { url } = useCurrentRoute();
    const { lang } = useLanguage();

    return (
      <CardsContainer {...props}>
        <Card
          style={{
            background:
              'radial-gradient(111.67% 100% at 0% 0%, #F2FFE6 0%, #C6FFF9 100%)'
          }}
        >
          <TradeIcon />
          <h1 className="title">{lang.landing_page.trade_card.title}</h1>
          <Text className="description">
            {lang.landing_page.trade_card.description}
          </Text>
          <div className="buttonContainer">
            <Link
              href={`/${Routes.TRADE}`}
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'StartTrading',
                  product: 'oasis-landing'
                });
              }}
              className="button-link"
            >
              <FilledButton>{lang.landing_page.trade_card.button}</FilledButton>
            </Link>
          </div>
        </Card>
        <Card
          style={{
            background:
              'radial-gradient(100% 100% at 0% 0%, #FFE9E9 0%, #FFE9B5 100%)'
          }}
        >
          <BorrowIcon />
          <h1 className="title">{lang.landing_page.borrow_card.title}</h1>
          <Text className="description">
            {lang.landing_page.borrow_card.description}
          </Text>
          <div className="buttonContainer">
            <Link
              href={`/${Routes.BORROW}${url.search}`}
              prefetch={true}
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'BorrowDai',
                  product: 'oasis-landing'
                });
              }}
              className="button-link"
            >
              <FilledButton>
                {lang.landing_page.borrow_card.button}
              </FilledButton>
            </Link>
          </div>
        </Card>
        <Card
          style={{
            background:
              'radial-gradient(100% 100% at 0% 0%, #E2FFCC 0%, #FFF1CF 100%)',
            marginBottom: 0
          }}
        >
          <SaveIcon />
          <h1 className="title">{lang.landing_page.save_card.title}</h1>
          <Text className="description">
            {lang.landing_page.save_card.description}
          </Text>
          <div className="buttonContainer">
            <Link
              href={`/${Routes.SAVE}${url.search}`}
              prefetch={true}
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'SaveDai',
                  product: 'oasis-landing'
                });
              }}
              className="button-link"
            >
              <FilledButton>{lang.landing_page.save_card.button}</FilledButton>
            </Link>
          </div>
        </Card>
      </CardsContainer>
    );
  };
})();

const SupportedTokens = (() => {
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
      name: 'USDC',
      icon: UsdcIcon
    },
    {
      name: 'WBTC',
      icon: WbtcIcon,
      onlyOnTrade: false
    },
    {
      name: 'Augur',
      icon: RepIcon,
      onlyOnTrade: true
    },
    {
      name: '0x',
      icon: ZrxIcon,
      onlyOnTrade: true
    },
    {
      name: 'LINK',
      icon: LinkIcon,
      onlyOnTrade: true
    },
    {
      name: 'PAX',
      icon: PaxIcon,
      onlyOnTrade: true
    },
    {
      name: 'TUSD',
      icon: TusdIcon,
      onlyOnTrade: true
    }
  ];

  const TokenList = styled(Grid)`
    margin: 74px auto 69px;
    justify-content: center;
    justify-items: center;

    grid-row-gap: 85px;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      grid-row-gap: 60px;
    }
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
      height: 70px;
    }

    span {
      margin-top: 28px;
      font-size: ${props => props.theme.typography.body.fontSize};
      letter-spacing: 0.5px;
      color: ${getColor('darkPurple')};
      position: relative;
    }

    span.onlyOnTrade:after {
      font-family: 'Arial Hebrew', Arial, sans-serif;
      content: '*';
      font-size: 2.7rem;
      position: absolute;
      top: 0.45rem;
      line-height: 20px;
    }
  `;

  const Token = ({ config: { name, icon, onlyOnTrade } }) => {
    const Icon = icon;
    return (
      <FadeIn triggerOffset={70}>
        <TokenStyle>
          <Icon />
          <span className={onlyOnTrade ? 'onlyOnTrade' : ''}>{name}</span>
        </TokenStyle>
      </FadeIn>
    );
  };

  return props => {
    const { lang } = useLanguage();

    return (
      <Box {...props}>
        <Text.h2>{lang.landing_page.token_section_title}</Text.h2>
        <TokenList
          gridTemplateColumns={{
            s: 'repeat(2, 1fr)',
            m: 'repeat(3, 1fr)',
            l: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)'
          }}
          maxWidth={{
            s: '313px',
            m: '656px',
            l: '850px',
            xl: '1080px'
          }}
        >
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
    );
  };
})();

const BlurryBackground = (() => {
  const ballsContainerOriginalWidth = 1440;

  // adjust this based on how much do we want the balls to move when reducing window size
  const ballsContainerMaxWidth = 1180;

  // converts absolute positioning to percentage based.
  const perc = absolutePx =>
    ((absolutePx / ballsContainerMaxWidth) * 100).toFixed(1);
  // changes the distance from original container width, to the new width.
  const adjustDistance = originalDistance =>
    originalDistance -
    (ballsContainerOriginalWidth - ballsContainerMaxWidth) / 2;

  const BallTop = styled.div`
    position: absolute;
    width: 206px;
    height: 206px;
    top: -45px;
    left: ${perc(adjustDistance(130))}%;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #eaffcf 0%,
      #fedb88 100%
    );
    border-radius: 50%;
    filter: blur(33px);
  `;

  const BallRight = styled.div`
    position: absolute;
    width: 83px;
    height: 83px;
    top: 619px;
    right: ${perc(adjustDistance(140))}%;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #d2ff72 0%,
      #fdc134 100%
    );
    border-radius: 50%;
    filter: blur(15px);
  `;

  const BlurryBackgroundStyle = styled.div`
    width: 100%;
    height: 100%;
    background: radial-gradient(
      99.92% 100% at 40.9% 100%,
      #f7fce7 0%,
      #fff9ed 54.69%,
      rgba(255, 249, 237, 0) 100%
    );
    z-index: -1;

    & > div {
      position: relative;
      max-width: ${ballsContainerMaxWidth}px;
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

const BulletPoints = (() => {
  const JumboBlock = styled(Box)`
    max-width: 966px;
    background: radial-gradient(100% 100% at 0% 0%, #f4ffec 0%, #fef4db 100%);
    text-align: left;
    padding: 120px 24px 122px;

    & > div:not(:first-child) {
      margin-top: 123px;
    }

    .title {
      margin-bottom: 21px;
    }

    width: 100vw;
    position: relative;
    left: -${props => props.theme.mobilePaddingX};

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      padding: 131px 13% 122px 12%;
      width: inherit;
      left: unset;

      .title {
        margin-bottom: 23px;
      }

      & > div:not(:first-child) {
        margin-top: 121px;
      }
    }
  `;

  return props => {
    const { lang } = useLanguage();

    return (
      <JumboBlock mr={{ s: 0, xl: '35px' }} {...props}>
        <div>
          <Text.h3 className="title">
            {lang.landing_page.section1_title}
          </Text.h3>
          <Text>{lang.landing_page.section1_p}</Text>
        </div>
        <div>
          <Text.h3 className="title">
            {lang.landing_page.section2_title}
          </Text.h3>
          <Text>{lang.landing_page.section2_p}</Text>
        </div>
        <div>
          <Text.h3 className="title">
            {lang.landing_page.section3_title}
          </Text.h3>
          <Text>{lang.landing_page.section3_p}</Text>
        </div>
      </JumboBlock>
    );
  };
})();

function Landing() {
  const { lang } = useLanguage();

  return (
    <MarketingLayout>
      <SEO title="Oasis" />
      <Content>
        <Box mt={{ s: '126px', m: '149px' }} px={{ s: '10px', m: 0 }}>
          <Text.h1>{lang.landing_page.headline}</Text.h1>
        </Box>
        <FadeIn moveDistance="47px">
          <Cards mt="72px" />
        </FadeIn>
        <SupportedTokens mt="200px" />
        <Box mt="323px" height="100%">
          <FullWidth
            style={{ height: '91%', position: 'absolute', top: '-25px' }}
            display={{ s: 'none', m: 'inherit' }}
          >
            <BlurryBackground />
          </FullWidth>
          <Box m="0 auto" display="inline-block">
            <FadeIn triggerOffset={150} moveDistance="80px">
              <BulletPoints />
            </FadeIn>
          </Box>
        </Box>
        <Box mt={{ s: '158px', m: '200px' }} mb="98px">
          <Text.h2>{lang.landing_page.questions_title}</Text.h2>
          <Questions
            questions={buildQuestionsFromLangObj(lang.landing_page, lang)}
          />
        </Box>
      </Content>
    </MarketingLayout>
  );
}

export default hot(Landing);
