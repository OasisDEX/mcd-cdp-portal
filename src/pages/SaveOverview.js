import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import useMaker from 'hooks/useMaker';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import {
  buildQuestionsFromLangObj,
  ConnectHero,
  Features,
  FixedHeaderTrigger,
  Questions,
  QuestionsWrapper,
  Quotes,
  GradientBox,
  ThickUnderline,
  Parallaxed,
  QuotesFadeIn,
  StyledPageContentLayout,
  SaveCalculator
} from '../components/Marketing';
import { Box, Text } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import styled from 'styled-components';
import { ReactComponent as FrontTrianglesBase } from 'images/landing/save/front-triangles.svg';
import { ReactComponent as BackTrianglesBase } from 'images/landing/save/back-triangles.svg';
import { ReactComponent as QuotesImg } from 'images/landing/save/quotes.svg';
import { ReactComponent as Feat1 } from 'images/landing/save/feature-1.svg';
import { ReactComponent as Feat2 } from 'images/landing/save/feature-2.svg';
import { ReactComponent as Feat3 } from 'images/landing/save/feature-3.svg';
import { ReactComponent as Feat4 } from 'images/landing/save/feature-4.svg';
import { ReactComponent as CalculatorLeftTriangles } from 'images/landing/save/calculator-left-triangles.svg';
import { ReactComponent as CalculatorRightTriangle } from 'images/landing/save/calculator-right-triangle.svg';
import { Link } from 'react-navi';
import { useDaiSavingsRate } from '../components/Marketing/Calculators';

const HeroBackground = (() => {
  const BackTriangles = styled(BackTrianglesBase)`
    position: absolute;
    left: -45px;
    top: -164px;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      left: -184px;
      top: -196px;
    }
  `;

  const FrontTriangles = styled(FrontTrianglesBase)`
    position: absolute;
    left: -35px;
    top: -76px;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      left: -178px;
      top: -121px;
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
        <BackTriangles />
        <Parallaxed style={{ zIndex: 10 }}>
          <FrontTriangles />
        </Parallaxed>
      </Box>
    </Box>
  );
})();

const StyledQuotes = styled(Quotes)`
  background: radial-gradient(100% 181.73% at 0% 0%, #feffc6 0%, #d5ffe3 100%);

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    :after {
      content: '';
      display: block;
      background: #c9ffe1;
      height: 80%;
      width: 110%;
      position: absolute;
      top: 13%;
      left: -5%;
      z-index: -1;
    }
  }
`;

function SaveOverview() {
  const { account, network, navigation } = useMaker();
  const { lang } = useLanguage();
  const dsr = useDaiSavingsRate()?.toNumber() - 1;

  useEffect(() => {
    if (account && account.address) {
      navigation.navigate(
        `/${Routes.SAVE}/owner/${account.address}?network=${network}`
      );
    }
  }, [account, navigation, network]);
  return (
    <StyledPageContentLayout>
      <FixedHeaderTrigger>
        <ConnectHero>
          <HeroBackground />
          <ThickUnderline background="linear-gradient(354.42deg, #B7FFB8 0%, #FCFF9E 64.82%)">
            <Text.h4>{lang.save_landing.page_name}</Text.h4>
          </ThickUnderline>
          <Text.h1
            className="headline"
            style={{ marginBottom: '17px' }}
            maxWidth="700px"
          >
            {lang.save_landing.headline}
          </Text.h1>
          <Box minHeight="81px" maxWidth="720px">
            <Text>{lang.save_landing.subheadline}</Text>
          </Box>
          <Text fontSize="s" className="connect-to-start">
            {lang.save_landing.connect_to_start}
          </Text>
          <AccountSelection className="button" />
        </ConnectHero>
      </FixedHeaderTrigger>
      <GradientBox
        mt="141px"
        background="linear-gradient(170.64deg, #f5ffda 7.17%, rgba(255, 245, 222, 0.490208) 59.55%, #f5ffda 108.77%)"
      >
        <QuotesFadeIn>
          <StyledQuotes
            title={lang.save_landing.quotes_block.title}
            body={<Box mb="95px">{lang.save_landing.quotes_block.body}</Box>}
            quote={lang.save_landing.quotes_block.quote1}
            author={lang.save_landing.quotes_block.author1}
            url="https://dsr.fyi/0xb277d98b101af4f1a1c7fe6d443f6993f1904237"
            quotesImg={<QuotesImg />}
          />
        </QuotesFadeIn>
        {dsr > 0 && (
          <Box m="256px auto 0" maxWidth="813px">
            <Text.h2 mb="16px">{lang.save_landing.calc_heading}</Text.h2>
            <Text>{lang.save_landing.calc_subheading}</Text>
            <Box position="relative">
              <Parallaxed
                initialOffset={1750}
                style={{
                  position: 'absolute',
                  top: '177px',
                  width: '100%',
                  height: '400px'
                }}
              >
                <CalculatorLeftTriangles
                  style={{ position: 'absolute', left: '-172px' }}
                />
                <CalculatorRightTriangle
                  style={{
                    position: 'absolute',
                    right: '-205px',
                    top: '107px'
                  }}
                />
              </Parallaxed>
              <SaveCalculator mt="40px" />
            </Box>
          </Box>
        )}
      </GradientBox>
      <Features
        mt={{ s: '158px', m: '200px' }}
        features={[<Feat1 />, <Feat2 />, <Feat3 />, <Feat4 />].map(
          (img, index) => ({
            img: img,
            title: lang.save_landing[`feature${index + 1}_heading`],
            content: lang.save_landing[`feature${index + 1}_content`]
          })
        )}
      />
      <QuestionsWrapper>
        <Text.h2>{lang.landing_page.questions_title}</Text.h2>
        <Questions
          questions={buildQuestionsFromLangObj(
            lang.save_landing.questions,
            lang
          )}
          links={
            <Link
              href="https://community-development.makerdao.com/makerdao-mcd-faqs/faqs/dsr"
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang.save_landing.questions.bottom_link1}
            </Link>
          }
        />
      </QuestionsWrapper>
    </StyledPageContentLayout>
  );
}

export default hot(SaveOverview);
