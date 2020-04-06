import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useNavigation } from 'react-navi';
import PageContentLayout from 'layouts/PageContentLayout';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { Box, Text } from '@makerdao/ui-components-core';
import { ConnectHero, HollowButton } from '../components/Marketing';

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
        <Text.h4>{lang.borrow_landing.page_name}</Text.h4>
        <Text.h1>{lang.borrow_landing.headline}</Text.h1>
        <Box height="172px" maxWidth="720px">
          <Text>{lang.borrow_landing.subheadline}</Text>
        </Box>
        <Text fontSize="19px">{lang.borrow_landing.connect_to_start}</Text>
        <AccountSelection buttonWidth="248px" mb="8px" />
        <HollowButton width="248px">{lang.see_how_it_works}</HollowButton>
      </ConnectHero>
    </PageContentLayout>
  );
}

export default hot(Borrow);
