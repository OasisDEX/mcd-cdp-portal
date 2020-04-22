import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Link, useNavigation } from 'react-navi';
import styled from 'styled-components';
import PageContentLayout from 'layouts/PageContentLayout';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { Box, Position, Text } from '@makerdao/ui-components-core';
import {
  ConnectHero,
  ThickUnderline,
  Quotes,
  GradientBox,
  Features,
  Questions,
  buildQuestionsFromLangObj,
  FixedHeaderTrigger,
  Parallaxed,
  QuotesFadeIn,
  SeparatorDot,
  H1,
  H2
} from '../components/Marketing';

import { ReactComponent as QuotesImg } from 'images/landing/borrow/quotes.svg';
import { ReactComponent as Feat1 } from 'images/landing/borrow/feature-1.svg';
import { ReactComponent as Feat2 } from 'images/landing/borrow/feature-2.svg';
import { ReactComponent as Feat3 } from 'images/landing/borrow/feature-3.svg';
import { ReactComponent as Feat4 } from 'images/landing/borrow/feature-4.svg';

const Ball = styled.div`
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
`;

const FrontBall = styled(Ball)`
  background: radial-gradient(
    51.51% 110.6% at 32.77% 50%,
    #d2ff72 0%,
    #fdc134 100%
  );
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.15);
`;

const HeroBackground = (() => {
  const BlurryBall = styled(Ball).attrs(() => ({
    size: '154px'
  }))`
    position: absolute;
    top: 7px;
    right: -110px;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #e8ffb7 0%,
      #ffe29d 100%
    );
    filter: blur(20px);

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      top: 56px;
    }
  `;

  const SmallBlurryBall = styled(Ball).attrs(() => ({
    size: '72px'
  }))`
    position: absolute;
    top: 434px;
    left: 143px;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #eaffcf 0%,
      #fedb88 100%
    );
    filter: blur(13px);
  `;

  const DimBall = styled(Ball)`
    background: linear-gradient(271.64deg, #fff1cd 0%, #fefea5 100%);
  `;

  const Pos = styled(Position)`
    position: absolute;
  `;

  return () => (
    <Box
      width="100%"
      zIndex="-1"
      height="670px"
      style={{ position: 'absolute' }}
    >
      <Box maxWidth="866px" m="0 auto">
        <BlurryBall />
        <Pos top={{ s: '-30px', m: '13px' }} left={{ s: '-86px', m: '-83px' }}>
          <DimBall size="352px" />
          <Parallaxed
            style={{ position: 'absolute', top: '-36px', left: '-67px' }}
          >
            <FrontBall size="212px" />
          </Parallaxed>
          <SmallBlurryBall />
        </Pos>
        <Pos
          top={{ s: '306px', m: '354px' }}
          right={{ s: '-105px', m: '-18px' }}
        >
          <DimBall size="182px" />
          <Parallaxed
            style={{ position: 'absolute', top: '98px', left: '-33px' }}
          >
            <FrontBall size="86px" />
          </Parallaxed>
        </Pos>
      </Box>
    </Box>
  );
})();

const BlurryBall = styled.div`
  position: absolute;
  width: 83px;
  height: 83px;
  top: 111px;
  left: -111px;
  background: radial-gradient(
    51.51% 110.6% at 32.77% 50%,
    #d2ff72 0%,
    #fdc134 100%
  );
  border-radius: 50%;
  filter: blur(15px);
`;

const StyledQuotes = styled(Quotes)`
  background: radial-gradient(100% 181.73% at 0% 0%, #fef1d1 0%, #f9fb9e 100%);

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    :after {
      content: '';
      display: block;
      background: #ffeec5;
      height: 98%;
      width: 58%;
      position: absolute;
      top: 49px;
      right: -40px;
      z-index: -1;
    }
  }
`;

function Borrow() {
  const { account } = useMaker();
  const navigation = useNavigation();
  const { lang } = useLanguage();

  useEffect(() => {
    async function redirect() {
      if (account) {
        const { search } = (await navigation.getRoute()).url;
        navigation.navigate({
          pathname: `/${Routes.BORROW}/owner/${account.address}`,
          search
        });
      }
    }
    redirect();
  }, [account, navigation]);

  return (
    <PageContentLayout>
      <FixedHeaderTrigger>
        <ConnectHero>
          <HeroBackground />
          <ThickUnderline background="linear-gradient(176.36deg, #FFE9E9 26.84%, #FFDB87 97.79%)">
            <Text.h4>{lang.borrow_landing.page_name}</Text.h4>
          </ThickUnderline>
          <H1 className="headline">{lang.borrow_landing.headline}</H1>
          <Box minHeight="128px" maxWidth="720px">
            <Text>{lang.borrow_landing.subheadline}</Text>
          </Box>
          <Text fontSize="s" className="connect-to-start">
            {lang.borrow_landing.connect_to_start}
          </Text>
          <AccountSelection className="button" buttonWidth="248px" />
        </ConnectHero>
      </FixedHeaderTrigger>
      <GradientBox
        mt="226px"
        background="linear-gradient(170.64deg, #f5ffda 7.17%, rgba(255, 245, 222, 0.490208) 59.55%, #f5ffda 108.77%)"
      >
        <Box display="inline-block">
          <BlurryBall />
          <QuotesFadeIn>
            <StyledQuotes
              title={lang.borrow_landing.quotes_block.title}
              body={lang.borrow_landing.quotes_block.body}
              quote={lang.borrow_landing.quotes_block.quote1}
              author={lang.borrow_landing.quotes_block.author1}
              url={`/${Routes.BORROW}/2434`}
              quotesImg={<QuotesImg />}
            >
              <Box
                display={{ s: 'none', m: 'block' }}
                style={{ position: 'static' }}
              >
                <Parallaxed
                  initialOffset="1100"
                  style={{
                    position: 'absolute',
                    bottom: '-110px',
                    right: '-110px'
                  }}
                >
                  <FrontBall size="180px" />
                </Parallaxed>
              </Box>
            </StyledQuotes>
          </QuotesFadeIn>
        </Box>
      </GradientBox>
      <Features
        mt={{ s: '158px', m: '200px' }}
        features={[<Feat1 />, <Feat2 />, <Feat3 />, <Feat4 />].map(
          (img, index) => ({
            img: img,
            title: lang.borrow_landing[`feature${index + 1}_heading`],
            content: lang.borrow_landing[`feature${index + 1}_content`]
          })
        )}
      />
      <Box mt={{ s: '159px', m: '280px' }} mb={{ s: '-37px', m: '126px' }}>
        <H2>{lang.landing_page.questions_title}</H2>
        <Questions
          questions={buildQuestionsFromLangObj(lang.landing_page, lang)}
          links={
            <>
              <Link
                href="https://community-development.makerdao.com/makerdao-mcd-faqs/faqs/vault"
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang.borrow_landing.questions.bottom_link1}
              </Link>
              <Box display={{ s: 'none', m: 'inline-block' }}>
                <SeparatorDot mx="24px" />
              </Box>
              <Link
                href="https://community-development.makerdao.com/makerdao-mcd-faqs/faqs/glossary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang.borrow_landing.questions.bottom_link2}
              </Link>
            </>
          }
        />
      </Box>
    </PageContentLayout>
  );
}

export default hot(Borrow);
