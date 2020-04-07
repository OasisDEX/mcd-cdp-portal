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
  ThickUnderline
} from '../components/Marketing';
import Parallaxed from '../components/Marketing/Parallaxed';
import { ReactComponent as QuotesImg } from 'images/landing/borrow/quotes.svg';
import { TextBlock } from '../components/Typography';

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
  const Gradient = styled.div`
    background: linear-gradient(
      170.64deg,
      #f5ffda 7.17%,
      rgba(255, 245, 222, 0.490208) 59.55%,
      #f5ffda 108.77%
    );
    filter: blur(38px);
    z-index: -1;
    width: 100%;
    height: 100%;
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
      <FullWidth style={{ position: 'absolute', top: 0, bottom: 0 }}>
        <Gradient />
      </FullWidth>
      <Box style={{ display: 'inline-block' }}>
        <BlurryBall />
        {children}
      </Box>
    </GradientBoxStyle>
  );
})();

const QuotesBox = (() => {
  const QuotesBoxStyle = styled(Box)`
    background: radial-gradient(
      100% 181.73% at 0% 0%,
      #fef1d1 0%,
      #f9fb9e 100%
    );
    max-width: 980px;
    padding: 100px 100px 148px;
    margin: 0 auto;

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

    position: relative;
  `;

  const Quote = styled(TextBlock)`
    font-weight: 500;
    font-size: 19px;
    line-height: 30px;
    max-width: 660px;
    margin: 0 auto;
  `;

  const Author = styled(Text)`
    text-decoration: underline;
    :before {
      content: ' ';
    }
  `;

  const StyledQuotesImg = styled(QuotesImg)`
    position: absolute;
    left: 0;
  `;

  return () => {
    const { lang } = useLanguage();
    const { quotes_block } = lang.borrow_landing;

    return (
      <QuotesBoxStyle>
        <Text.h1 mb="16px">{quotes_block.title}</Text.h1>
        <Text>{quotes_block.body}</Text>
        <Box mt="16px">
          <StyledQuotesImg />
          <Quote>{quotes_block.quote1}</Quote>
          <Text>— </Text>
          <Author>{quotes_block.author1}</Author>
        </Box>
        <Parallaxed
          initialOffset="1388"
          style={{ position: 'absolute', bottom: '78px', right: '70px' }}
        >
          <FrontBall size="180px" />
        </Parallaxed>
      </QuotesBoxStyle>
    );
  };
})();

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
      <GradientBox mt="226px">
        <QuotesBox />
      </GradientBox>
    </PageContentLayout>
  );
}

export default hot(Borrow);
