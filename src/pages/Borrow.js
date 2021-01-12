import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Link, useNavigation } from 'react-navi';
import styled from 'styled-components';
import AccountSelection from 'components/AccountSelection';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { Box, Flex, Grid, Position, Text } from '@makerdao/ui-components-core';
import { getColor } from 'styles/theme';
import {
  ConnectHero,
  ThickUnderline,
  Quotes,
  GradientBox,
  Features,
  Questions,
  QuestionsWrapper,
  buildQuestionsFromLangObj,
  FixedHeaderTrigger,
  Parallaxed,
  QuotesFadeIn,
  SeparatorDot,
  BorrowCalculator,
  StyledPageContentLayout,
  PageHead,
  MarketsTable,
  HollowButton
} from 'components/Marketing';

import useCdpTypes from 'hooks/useCdpTypes';
import { watch } from 'hooks/useObservable';

import { ReactComponent as PlayIcon } from 'images/landing/borrow/play.svg';
import { ReactComponent as QuotesImg } from 'images/landing/borrow/quotes.svg';
import { ReactComponent as Feat1 } from 'images/landing/borrow/feature-1.svg';
import { ReactComponent as Feat2 } from 'images/landing/borrow/feature-2.svg';
import { ReactComponent as Feat3 } from 'images/landing/borrow/feature-3.svg';
import { ReactComponent as Feat4 } from 'images/landing/borrow/feature-4.svg';
import { ReactComponent as BtcToDai } from 'images/landing/borrow/btc-to-dai.svg';
import VimeoPlayer from '../components/Marketing/VimeoPlayer';
import MarketingLayout from '../layouts/MarketingLayout';
import mixpanel from 'mixpanel-browser';

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
        <Pos top={{ s: '-30px', m: '-17px' }} left={{ s: '-86px', m: '-83px' }}>
          <DimBall size="280px" />
          <Parallaxed
            style={{ position: 'absolute', top: '-36px', left: '-67px' }}
          >
            <FrontBall size="186px" />
          </Parallaxed>
          <SmallBlurryBall />
        </Pos>
        <Pos
          top={{ s: '306px', m: '270px' }}
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

const WBTCNoticeStyle = styled(Flex)`
  background: linear-gradient(286.06deg, #fff1cd 0%, #fefea5 100%);
  opacity: 0.8;
  border-radius: 40px;
  display: inline-flex;
  align-items: center;
  padding: 18px 32px;
  text-align: left;
  svg {
    margin-right: 22px;
  }

  span {
    flex-shrink: 1;
  }

  a {
    white-space: nowrap;
    text-decoration: underline;
  }
`;

const WBTCNotice = ({ lang, ...props }) => {
  const navigation = useNavigation();
  return (
    <WBTCNoticeStyle {...props}>
      <BtcToDai />
      <span>
        {lang.borrow_landing.wbtc_notice}{' '}
        <Link href={`${navigation.basename}/btc`}>{lang.learn_more}</Link>
      </span>
    </WBTCNoticeStyle>
  );
};

// disableConnect is for testing
function Borrow({ disableConnect = false }) {
  const { account } = useMaker();
  const navigation = useNavigation();
  const { lang } = useLanguage();

  useEffect(() => {
    async function redirect() {
      if (!disableConnect && account) {
        const { search } = (await navigation.getRoute()).url;
        navigation.navigate({
          pathname: `${navigation.basename}/owner/${account.address}`,
          search
        });
      }
    }
    redirect();
  }, [account, navigation, disableConnect]);

  const { cdpTypesList } = useCdpTypes();
  const prices = watch.collateralTypesPrices(
    cdpTypesList?.length ? cdpTypesList : []
  );

  const [showVideo, setShowVideo] = useState(false);

  return (
    <MarketingLayout showNavInFooter={true}>
      <StyledPageContentLayout>
        <PageHead
          title={lang.borrow_landing.meta.title}
          description={lang.borrow_landing.meta.description}
        />
        <VimeoPlayer
          id="427849477"
          showVideo={showVideo}
          onCloseVideo={() => setShowVideo(false)}
        />
        <FixedHeaderTrigger>
          <ConnectHero>
            <HeroBackground />
            <ThickUnderline background="linear-gradient(176.36deg, #FFE9E9 26.84%, #FFDB87 97.79%)">
              <Text.h4>{lang.borrow_landing.page_name}</Text.h4>
            </ThickUnderline>
            <Text.h1 className="headline">
              {lang.borrow_landing.headline}
            </Text.h1>
            <Box minHeight="81px" maxWidth="720px">
              <Text>{lang.borrow_landing.subheadline}</Text>
            </Box>
            <Text fontSize="s" className="connect-to-start">
              {lang.borrow_landing.connect_to_start}
            </Text>
            <Grid
              width={{ s: '213px', m: 'unset' }}
              mt={{ s: '10px', m: '2px' }}
              mb={{ s: 'unset', m: '2px' }}
              gridTemplateColumns={{ s: 'unset', m: 'auto 213px' }}
              gridTemplateRows={{ s: '44px 60px', m: '60px' }}
              gridColumnGap="22px"
              alignItems="center"
            >
              <HollowButton
                height="44px"
                position="relative"
                style={{ top: '2px', backdropFilter: 'blur(25px)' }}
                px="24px"
                onClick={() => {
                  setShowVideo(true);
                  mixpanel.track('btn-click', {
                    id: 'PlayVideo',
                    product: 'oasis-borrow'
                  });
                }}
              >
                <PlayIcon
                  style={{
                    fill: getColor('darkPurple'),
                    marginRight: '9px',
                    marginLeft: '-4px'
                  }}
                />
                {lang.see_how_it_works}
              </HollowButton>
              <AccountSelection className="button" width="100%" />
            </Grid>
          </ConnectHero>
        </FixedHeaderTrigger>
        <WBTCNotice lang={lang} mt="30px" />
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
                url={`${navigation.basename}/2434`}
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
                    <FrontBall size="164px" />
                  </Parallaxed>
                </Box>
              </StyledQuotes>
            </QuotesFadeIn>
          </Box>
          <Box m="296px auto 0" maxWidth="980px">
            <Text.h2 mb="16px">{lang.borrow_landing.calc_heading}</Text.h2>
            <Text>{lang.borrow_landing.calc_subheading}</Text>
            {prices?.length && cdpTypesList?.length ? (
              <BorrowCalculator
                mt="40px"
                prices={prices}
                cdpTypesList={cdpTypesList}
              />
            ) : null}
          </Box>
        </GradientBox>
        <Features
          mt={{ s: '158px', m: '207px' }}
          features={[Feat1, Feat2, Feat3, Feat4].map((img, index) => ({
            img: img,
            title: lang.borrow_landing[`feature${index + 1}_heading`],
            content: lang.borrow_landing[`feature${index + 1}_content`]
          }))}
        />
        <Box maxWidth="1007px" m="204px auto 0">
          <Box maxWidth="777px" m="0 auto">
            <Text.h2 mb="34px">{lang.borrow_markets.heading}</Text.h2>
            <Text>{lang.borrow_markets.subheading}</Text>
          </Box>
          <Box
            mt={{ s: '54px', m: '87px' }}
            css={`
              overflow-x: scroll;
              overflow-y: hidden;
              &::-webkit-scrollbar {
                display: none;
              }
              -ms-overflow-style: none;
            `}
          >
            <MarketsTable
              cdpTypesList={cdpTypesList.filter(symbol =>
                ['ETH', 'BAT', 'USDC', 'WBTC'].includes(symbol.split('-')[0])
              )}
            />
          </Box>
          <Box
            textAlign="left"
            mt={{ s: '20px', m: '35px' }}
            pl={{ s: '6px', m: '37px' }}
          >
            <Link
              href={`${navigation.basename}/markets`}
              style={{ textDecoration: 'underline' }}
            >
              {lang.borrow_landing.markets_link}
            </Link>
          </Box>
        </Box>
        <QuestionsWrapper mt="147px">
          <Text.h2>{lang.landing_page.questions_title}</Text.h2>
          <Questions
            questions={buildQuestionsFromLangObj(
              lang.borrow_landing.questions,
              lang
            )}
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
        </QuestionsWrapper>
      </StyledPageContentLayout>
    </MarketingLayout>
  );
}

export default hot(Borrow);
