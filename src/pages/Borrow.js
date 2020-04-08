import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useNavigation } from 'react-navi';
import styled from 'styled-components';
import PageContentLayout from 'layouts/PageContentLayout';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { Box, Text } from '@makerdao/ui-components-core';
import {
  ConnectHero,
  HollowButton,
  FullWidth,
  ThickUnderline,
  QuotesBox,
  Features,
  Questions,
  buildQuestionsFromLangObj,
  FixedHeaderTrigger,
  Parallaxed
} from '../components/Marketing';

import { ReactComponent as QuotesImg } from 'images/landing/borrow/quotes.svg';
import { ReactComponent as Feat1 } from 'images/landing/borrow/feature-1.svg';
import { ReactComponent as Feat2 } from 'images/landing/borrow/feature-2.svg';
import { ReactComponent as Feat3 } from 'images/landing/borrow/feature-3.svg';
import { ReactComponent as Feat4 } from 'images/landing/borrow/feature-4.svg';

const FrontBall = styled.div`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  background: radial-gradient(
    51.51% 110.6% at 32.77% 50%,
    #d2ff72 0%,
    #fdc134 100%
  );
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.15);
`;

const HeroBackground = (() => {
  const GradientThingy = styled.div`
    position: absolute;
    width: 242px;
    height: 325px;
    top: -22px;
    right: -45px;

    background: linear-gradient(
      89.4deg,
      #faf9a6 0.85%,
      rgba(254, 241, 208, 0) 99.47%
    );
    transform: rotate(-180deg);
  `;

  const BlurryBall = styled.div`
    position: absolute;
    width: 194px;
    height: 194px;
    top: 231px;
    right: -139px;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #d2ff72 0%,
      #fdc134 100%
    );
    border-radius: 50%;
    filter: blur(15px);
  `;

  const SmallBlurryBall = styled.div`
    position: absolute;
    top: 404px;
    left: 48px;
    width: 72px;
    height: 72px;
    background: radial-gradient(
      51.51% 110.6% at 32.77% 50%,
      #eaffcf 0%,
      #fedb88 100%
    );
    radial-gradient(51.51% 110.6% at 32.77% 50%, #D2FF72 0%, #FDC134 100%);
    border-radius: 50%;
    filter: blur(13px);
  
  `;

  const Ball = styled(FrontBall).attrs(() => ({
    size: '212px'
  }))`
    top: -38px;
    left: -159px;
  `;

  const SmallBall = styled(FrontBall).attrs(() => ({
    size: '86px'
  }))`
    top: 492px;
    right: 120px;
  `;

  return () => (
    <FullWidth zIndex="-1" height="670px" style={{ position: 'absolute' }}>
      <Box maxWidth="866px" m="0 auto">
        <GradientThingy />
        <BlurryBall />
        <SmallBlurryBall />
        <Parallaxed style={{ position: 'static' }}>
          <Ball />
          <SmallBall />
        </Parallaxed>
      </Box>
    </FullWidth>
  );
})();

const GradientBox = (() => {
  const Gradient = styled(FullWidth)`
    background: linear-gradient(
      170.64deg,
      #f5ffda 7.17%,
      rgba(255, 245, 222, 0.490208) 59.55%,
      #f5ffda 108.77%
    );
    filter: blur(38px);
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
  `;

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

  const GradientBoxStyle = styled(Box)`
    position: relative;
    padding: 116px 0 121px;
  `;

  return ({ children, ...props }) => (
    <GradientBoxStyle {...props}>
      <Gradient />
      <Box style={{ display: 'inline-block' }}>
        <BlurryBall />
        {children}
      </Box>
    </GradientBoxStyle>
  );
})();

const StyledQuotesBox = styled(QuotesBox)`
  background: radial-gradient(100% 181.73% at 0% 0%, #fef1d1 0%, #f9fb9e 100%);
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
      <FixedHeaderTrigger offset={{ top: 60 }}>
        <ConnectHero>
          <HeroBackground />
          <ThickUnderline background="linear-gradient(170.88deg, #d2ff72 9.13%, #fdc134 87.83%)">
            <Text.h4>{lang.borrow_landing.page_name}</Text.h4>
          </ThickUnderline>
          <Text.h1 mt="16px" mb="21px">
            {lang.borrow_landing.headline}
          </Text.h1>
          <Box height="166px" maxWidth="720px">
            <Text>{lang.borrow_landing.subheadline}</Text>
          </Box>
          <Text fontSize="19px">{lang.borrow_landing.connect_to_start}</Text>
          <AccountSelection buttonWidth="248px" mt="17px" mb="8px" />
          <HollowButton width="248px">{lang.see_how_it_works}</HollowButton>
        </ConnectHero>
      </FixedHeaderTrigger>
      <GradientBox mt="226px">
        <StyledQuotesBox
          title={lang.borrow_landing.quotes_block.title}
          body={lang.borrow_landing.quotes_block.body}
          quote={lang.borrow_landing.quotes_block.quote1}
          author={lang.borrow_landing.quotes_block.author1}
          quotesImg={<QuotesImg />}
        >
          <Parallaxed
            initialOffset="1388"
            style={{ position: 'absolute', bottom: '78px', right: '70px' }}
          >
            <FrontBall size="180px" />
          </Parallaxed>
        </StyledQuotesBox>
      </GradientBox>
      <Features
        mt="200px"
        features={[<Feat1 />, <Feat2 />, <Feat3 />, <Feat4 />].map(
          (img, index) => ({
            img: img,
            title: lang.borrow_landing[`point${index + 1}_heading`],
            content: lang.borrow_landing[`point${index + 1}_content`]
          })
        )}
      />
      <Box mt="153px" mb="126px">
        <Text.h2>{lang.landing_page.questions_title}</Text.h2>
        <Questions
          questions={buildQuestionsFromLangObj(lang.landing_page, lang)}
        />
      </Box>
    </PageContentLayout>
  );
}

export default hot(Borrow);
