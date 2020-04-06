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
import { ConnectHero, HollowButton, FullWidth } from '../components/Marketing';

const HeroBackground = (() => {
  const GradientThingy = styled(Box)`
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

  const BigBlurryBall = styled.div`
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

  return () => (
    <FullWidth
      zIndex="-1"
      height="670px"
      style={{ position: 'absolute', overflowX: 'hidden' }}
    >
      <Box maxWidth="866px" m="0 auto">
        <GradientThingy />
        <BigBlurryBall />
        <SmallBlurryBall />
      </Box>
    </FullWidth>
  );
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
        <Text.h4>{lang.borrow_landing.page_name}</Text.h4>
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
      <Box height="300px" />
    </PageContentLayout>
  );
}

export default hot(Borrow);
