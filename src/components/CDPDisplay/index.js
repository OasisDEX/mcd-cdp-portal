import React, { useMemo, useCallback } from 'react';
import { hot } from 'react-hot-loader/root';
import LoadingLayout from 'layouts/LoadingLayout';
import { getColor } from 'styles/theme';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import CDPViewPresentation from './Presentation';
import Unavailable from '../Unavailable';
import { Routes } from '../../utils/constants';
import { useNavigation } from 'react-navi';
import { watch } from 'hooks/useObservable';

function CDPView({ cdpId }) {
  cdpId = parseInt(cdpId, 10);
  const { account, network } = useMaker();

  const { show: showSidebar } = useSidebar();
  const navigation = useNavigation();

  // eslint-disable-next-line
  const redirect = useCallback(
    account => {
      (async function redirect() {
        const { search } = (await navigation.getRoute()).url;
        navigation.navigate({
          pathname: `/${Routes.BORROW}/owner/${account.address}`,
          search
        });
      })();
    },
    [navigation]
  );

  const vault = watch.vault(cdpId);
  return useMemo(
    () =>
      vault && vault.externalOwnerAddress ? (
        <CDPViewPresentation
          vault={vault}
          showSidebar={showSidebar}
          account={account}
          network={network}
          cdpOwner={vault.externalOwnerAddress}
        />
      ) : vault && vault.externalOwnerAddress === null ? (
        <Unavailable />
      ) : vault === null ? (
        <Unavailable />
      ) : (
        <LoadingLayout background={getColor('lightGrey')} />
      ),
    [vault, showSidebar, account, network]
  );
}

export default hot(CDPView);
