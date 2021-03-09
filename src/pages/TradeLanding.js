import React from 'react';
import { hot } from 'react-hot-loader/root';
import {
  buildQuestionsFromLangObj,
  ConnectHero,
  Features,
  FixedHeaderTrigger,
  Questions,
  QuestionsWrapper,
  Quotes,
  ThickUnderline,
  Parallaxed,
  FilledButton,
  QuotesFadeIn,
  GradientBox,
  StyledPageContentLayout,
  PageHead
} from '../components/Marketing';
import { Box, Text } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import styled from 'styled-components';
import { ReactComponent as FrontParallelogramsBase } from 'images/landing/trade/front-parallelograms.svg';
import { ReactComponent as BackParallelogramsBase } from 'images/landing/trade/back-parallelograms.svg';
import { ReactComponent as QuotesImg } from 'images/landing/trade/quotes.svg';
import { ReactComponent as Feat1 } from 'images/landing/trade/feature-1.svg';
import { ReactComponent as Feat2 } from 'images/landing/trade/feature-2.svg';
import { ReactComponent as Feat3 } from 'images/landing/trade/feature-3.svg';
import { ReactComponent as Feat4 } from 'images/landing/trade/feature-4.svg';
import MarketingLayout from '../layouts/MarketingLayout';

const StyledConnectHero = styled(ConnectHero)`
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    margin: 178px auto 0;
  }
`;

const HeroBackground = (() => {
  const BackParallelograms = styled(BackParallelogramsBase)`
    position: absolute;
    left: -81px;
    top: -45px;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      left: -66px;
      top: -123px;
    }
  `;

  const FrontParallelograms = styled(FrontParallelogramsBase)`
    position: absolute;
    left: -162px;
    top: 0;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      left: -171px;
      top: -143px;
    }
  `;

  return () => (
    <Box
      width="100%"
      zIndex="-1"
      height="670px"
      style={{ position: 'absolute' }}
    >
      <Box maxWidth="866px" m="0 auto">
        <BackParallelograms />
        <Parallaxed style={{ zIndex: 10 }}>
          <FrontParallelograms />
        </Parallaxed>
      </Box>
    </Box>
  );
})();

const StyledQuotes = styled(Quotes)`
  background: linear-gradient(125.71deg, #cbfffa 0%, #e7fce9 100%);

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    :after {
      content: '';
      display: block;
      background: #bffff8;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 40px;
      left: 40px;
      z-index: -1;
    }
  }
`;

function TradeLanding() {
  const { lang } = useLanguage();
  const ctaButton = (
    <a href="https://oasis.app/trade">
      <FilledButton className="button" width="185px" height="44px">
        {lang.trade_landing.cta_button}
      </FilledButton>
    </a>
  );

  return (
    <MarketingLayout
      showNavInFooter={true}
      extraLegalLinks={[
        {
          url:
            'https://github.com/OasisDEX/OasisTradeDigitalAssessmentFramework/raw/main/Oasis%20Trade%20Digital%20Asset%20Assessment%20Framework.pdf',
          text: 'Asset Ass. Framework'
        }
      ]}
    >
      <StyledPageContentLayout enableNotifications={false}>
        <PageHead
          title={lang.trade_landing.meta.title}
          description={lang.trade_landing.meta.description}
          imgUrl="https://oasis.app/meta/Oasis_Trade.png"
        />
        <FixedHeaderTrigger cta={ctaButton}>
          <StyledConnectHero>
            <HeroBackground />
            <ThickUnderline background="linear-gradient(176.45deg, #ECFFDA 18.9%, #AFFFFA 100%)">
              <Text.h4>{lang.trade_landing.page_name}</Text.h4>
            </ThickUnderline>
            <Text.h1 className="headline" style={{ marginBottom: '17px' }}>
              {lang.trade_landing.headline}
            </Text.h1>
            <Box
              minHeight="107px"
              maxWidth="760px"
              mb={{ s: '9px', m: 'inherit' }}
            >
              <Text>{lang.trade_landing.subheadline}</Text>
            </Box>
            {ctaButton}
          </StyledConnectHero>
        </FixedHeaderTrigger>
        <GradientBox
          mt="211px"
          background="radial-gradient(242.42% 146.56% at 0% 0%, #E8FFFC 0%, #F8FFE6 50.52%, #E8FFFC 100%)"
        >
          <QuotesFadeIn>
            <StyledQuotes
              title={lang.trade_landing.quotes_block.title}
              body={<Box mb="95px">{lang.trade_landing.quotes_block.body}</Box>}
              quote={lang.trade_landing.quotes_block.quote1}
              author={lang.trade_landing.quotes_block.author1}
              quotesImg={<QuotesImg />}
            />
          </QuotesFadeIn>
        </GradientBox>
        <Features
          mt={{ s: '158px', m: '200px' }}
          features={[Feat1, Feat2, Feat3, Feat4].map((img, index) => ({
            img: img,
            title: lang.trade_landing[`feature${index + 1}_heading`],
            content: lang.trade_landing[`feature${index + 1}_content`]
          }))}
        />
        <QuestionsWrapper>
          <Text.h2>{lang.landing_page.questions_title}</Text.h2>
          <Questions
            questions={buildQuestionsFromLangObj(
              lang.trade_landing.questions,
              lang
            )}
          />
        </QuestionsWrapper>
      </StyledPageContentLayout>
    </MarketingLayout>
  );
}

export default hot(TradeLanding);
