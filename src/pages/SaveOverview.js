import React, { useEffect } from 'react';
import useMaker from 'hooks/useMaker';
import PageContentLayout from 'layouts/PageContentLayout';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import {
  ConnectHero,
  FullWidth,
  HollowButton,
  ThickUnderline
} from '../components/Marketing';
import { Box, Text } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import styled from 'styled-components';
import Parallaxed from '../components/Marketing/Parallaxed';
import { ReactComponent as BigBall } from 'images/landing/save/big-green-ball.svg';
const HeroBackground = (() => {
  const BlurryBall = styled.div`
    position: absolute;
    top: -54px;
    left: -137px;
    width: 231px;
    height: 231px;

    background: linear-gradient(89.83deg, #f7ffd8 0.17%, #9ffdca 86.64%);
    filter: blur(26px);
    border-radius: 50%;
  `;

  const GiantBall = styled.div`
    width: 485px;
    height: 485px;
    left: 333px;
    top: 192px;

    background: linear-gradient(89.83deg, #f7ffd8 0.17%, #42ff99 86.64%);
    opacity: 0.5;
    filter: blur(24px);
    border-radius: 50%;
    z-index: 1;
  `;

  const BigBallContainer = styled.div`
    position: absolute;
    left: 616px;
    top: -28px;
    z-index: 2;
  `;

  const SmallBall = styled.div`
    position: absolute;
    width: 99px;
    height: 99px;
    right: -62px;
    bottom: 140px;

    background: radial-gradient(
      41.9% 43.29% at 35.65% 50%,
      #f7ffd8 0%,
      #42ff99 100%
    );
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
  `;

  return () => (
    <FullWidth zIndex="-1" height="670px" style={{ position: 'absolute' }}>
      <Box maxWidth="866px" m="0 auto">
        <BlurryBall />
        <GiantBall />
        <BigBallContainer>
          <BigBall />
        </BigBallContainer>
        <Parallaxed style={{ zIndex: 10 }}>
          <SmallBall />
        </Parallaxed>
      </Box>
    </FullWidth>
  );
})();

function SaveOverview() {
  const { account, network, navigation } = useMaker();
  const { lang } = useLanguage();

  useEffect(() => {
    if (account && account.address) {
      navigation.navigate(
        `/${Routes.SAVE}/owner/${account.address}?network=${network}`
      );
    }
  }, [account, navigation, network]);
  return (
    <PageContentLayout>
      <ConnectHero>
        <HeroBackground />
        <ThickUnderline background="linear-gradient(173.93deg, #F7FFD8 14.25%, #42FF99 80.99%)">
          <Text.h4>{lang.save_landing.page_name}</Text.h4>
        </ThickUnderline>
        <Text.h1 mt="16px" mb="21px" maxWidth="700px">
          {lang.save_landing.headline}
        </Text.h1>
        <Box height="166px" maxWidth="630px">
          <Text>{lang.save_landing.subheadline}</Text>
        </Box>
        <Text fontSize="19px">{lang.save_landing.connect_to_start}</Text>
        <AccountSelection buttonWidth="248px" mt="17px" mb="8px" />
        <HollowButton width="248px">{lang.see_how_it_works}</HollowButton>
      </ConnectHero>
      <Box height="300px" />
    </PageContentLayout>
  );
}

export default SaveOverview;
