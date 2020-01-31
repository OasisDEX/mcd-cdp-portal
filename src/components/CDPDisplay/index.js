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

  // useEffect(() => {
  //   (async () => {
  //     const proxyAddress = await maker
  //       .service('mcd:cdpManager')
  //       .getOwner(cdpId);
  //     if (proxyAddress === ZERO_ADDRESS) {
  //       account ? redirect(account) : setCdpAvailable(false);
  //     } else {
  //       try {
  //         const cdpOwnerAddress = await maker
  //           .service('proxy')
  //           .getOwner(proxyAddress);
  //         setOwner(cdpOwnerAddress);
  //       } catch (err) {
  //         // cdp is not owned by a proxy
  //         setOwner(proxyAddress);
  //       }
  //     }
  //   })();
  // }, [maker, cdpId, account, navigation, redirect]);

  // this workaround (making useMemo depend on just one feed item) ensures that
  // the view does not re-render when an irrelevant price feed is updated.
  // TODO: there's definitely a more general solution to this issue, but i'm not
  // going to try to figure it out right now. let's collect more data first
  // about how it shows up in different situations.
  // const ilk = cdps[cdpId] ? cdps[cdpId].ilk : null;
  // const feed = ilk ? feeds.find(f => f.key === ilk) : null;
  // const cdp = useMemo(() => getCdp(cdpId, { cdps, feeds: [feed] }), [
  //   cdpId,
  //   cdps,
  //   feed
  // ]);

  // useEffect(() => {
  //   trackCdpById(maker, cdpId, dispatch).then(() => {
  //     if (!cdp.inited && !account) setCdpAvailable(false);
  //   });
  // }, [cdpId, dispatch, maker, account, cdp, redirect]);

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
      ) : vault === null ? (
        <Unavailable />
      ) : (
        <LoadingLayout background={getColor('lightGrey')} />
      ),
    [vault, showSidebar, account, network]
  );
}

export default hot(CDPView);
