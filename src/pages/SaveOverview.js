import React, { useEffect } from 'react';
import useMaker from 'hooks/useMaker';
import PageContentLayout from 'layouts/PageContentLayout';
import AccountSelection from 'components/AccountSelection';
import { Routes } from 'utils/constants';
import { ConnectHero, HollowButton } from '../components/Marketing';
import { Box, Text } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';

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
      <PageContentLayout>
        <ConnectHero>
          <Text.h4>{lang.save_landing.page_name}</Text.h4>
          <Text.h1 mt="16px" mb="21px" maxWidth="700px">
            {lang.save_landing.headline}
          </Text.h1>
          <Box height="166px" maxWidth="720px">
            <Text>{lang.save_landing.subheadline}</Text>
          </Box>
          <Text fontSize="19px">{lang.save_landing.connect_to_start}</Text>
          <AccountSelection buttonWidth="248px" mt="17px" mb="8px" />
          <HollowButton width="248px">{lang.see_how_it_works}</HollowButton>
        </ConnectHero>
        <Box height="300px" />
      </PageContentLayout>
    </PageContentLayout>
  );
}

export default SaveOverview;
