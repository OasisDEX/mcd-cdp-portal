import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useNavigation } from 'react-navi';
import PageContentLayout from 'layouts/PageContentLayout';
import AccountSelection from 'components/AccountSelection';
import { Routes } from '../utils/constants';
import useMaker from 'hooks/useMaker';

function Borrow() {
  const { account } = useMaker();
  const navigation = useNavigation();

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
      <AccountSelection />
    </PageContentLayout>
  );
}

export default hot(Borrow);
