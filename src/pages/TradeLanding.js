import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Link } from 'react-navi';
import PageContentLayout from 'layouts/PageContentLayout';

import {
  buildQuestionsFromLangObj,
  ConnectHero,
  Features,
  FixedHeaderTrigger,
  FullWidth,
  Questions,
  QuotesBox,
  ThickUnderline,
  Parallaxed,
  FadeIn,
  FilledButton,
  QuotesFadeIn
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

const StyledConnectHero = styled(ConnectHero)`
  margin: 127px auto 0;
`;

const HeroBackground = (() => {
  const BackParallelograms = styled(BackParallelogramsBase)`
    position: absolute;
    left: -98px;
    top: -129px;
  `;

  const FrontParallelograms = styled(FrontParallelogramsBase)`
    position: absolute;
    left: -179px;
    top: -84px;
  `;

  return () => (
    <FullWidth zIndex="-1" height="670px" style={{ position: 'absolute' }}>
      <Box maxWidth="866px" m="0 auto">
        <BackParallelograms />
        <Parallaxed style={{ zIndex: 10 }}>
          <FrontParallelograms />
        </Parallaxed>
      </Box>
    </FullWidth>
  );
})();

const StyledQuotesBox = styled(QuotesBox)`
  background: linear-gradient(125.71deg, #e7fcfa 0%, #e7fce9 100%);

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
`;

function TradeLanding() {
  const { lang } = useLanguage();
  const ctaButton = (
    <Link href="https://oasis.app/trade/market/">
      <FilledButton width="237px" mt="17px" mb="8px">
        {lang.trade_landing.cta_button}
      </FilledButton>
    </Link>
  );

  return (
    <PageContentLayout enableNotifications={false}>
      <FixedHeaderTrigger cta={ctaButton}>
        <StyledConnectHero>
          <HeroBackground />
          <ThickUnderline background="linear-gradient(176.45deg, #ECFFDA 18.9%, #AFFFFA 100%)">
            <Text.h4>{lang.trade_landing.page_name}</Text.h4>
          </ThickUnderline>
          <Text.h1 mt="16px" mb="23px">
            {lang.trade_landing.headline}
          </Text.h1>
          <Box height="83px">
            <Text>{lang.trade_landing.subheadline}</Text>
          </Box>
          {ctaButton}
        </StyledConnectHero>
      </FixedHeaderTrigger>
      <Box height="300px" />
      <QuotesFadeIn triggerOffset={180}>
        <StyledQuotesBox
          title={lang.trade_landing.quotes_block.title}
          body={<Box mb="95px">{lang.trade_landing.quotes_block.body}</Box>}
          quote={lang.trade_landing.quotes_block.quote1}
          author={lang.trade_landing.quotes_block.author1}
          url="https://chat.makerdao.com/group/team-marketing-internal"
          quotesImg={<QuotesImg />}
        />
      </QuotesFadeIn>
      <Features
        mt="249px"
        features={[<Feat1 />, <Feat2 />, <Feat3 />, <Feat4 />].map(
          (img, index) => ({
            img: img,
            title: lang.trade_landing[`feature${index + 1}_heading`],
            content: lang.trade_landing[`feature${index + 1}_content`]
          })
        )}
      />
      <Box mt="200px" mb="126px">
        <Text.h2>{lang.landing_page.questions_title}</Text.h2>
        <Questions
          questions={buildQuestionsFromLangObj(lang.landing_page, lang)}
        />
      </Box>
    </PageContentLayout>
  );
}

export default hot(TradeLanding);
