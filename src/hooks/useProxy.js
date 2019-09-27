import { useReducer, useEffect } from 'react';

import useActionState from 'hooks/useActionState';
import useBlockHeight from 'hooks/useBlockHeight';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { updateWatcherWithProxy } from '../watch';

const initialState = {
  initialProxyCheck: true,
  startingBlockHeight: 0,
  proxyAddress: undefined,
  startedWithoutProxy: false,
  proxyDeployed: false
};

export default function useProxy() {
  const { lang } = useLanguage();
  const { maker, account, newTxListener } = useMaker();
  const blockHeight = useBlockHeight(0);

  const [
    {
      initialProxyCheck,
      startingBlockHeight,
      proxyAddress,
      startedWithoutProxy,
      proxyDeployed
    },
    updateState
  ] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    initialState
  );

  const [setupProxy, proxyLoading, , proxyErrors] = useActionState(async () => {
    if (!account) return null;
    if (proxyAddress) return proxyAddress;

    const txPromise = maker.service('proxy').ensureProxy();

    newTxListener(txPromise, lang.transactions.setting_up_proxy);
    const address = await txPromise;

    updateState({
      startingBlockHeight: blockHeight,
      proxyAddress: address
    });

    await updateWatcherWithProxy(maker, account.address, address);
    await maker.service('transactionManager').confirm(txPromise, 7);

    updateState({ proxyDeployed: true });
    return address;
  });

  useEffect(() => {
    if (account) {
      (async () => {
        updateState({ initialProxyCheck: true });
        const proxyAddress = await maker.service('proxy').getProxyAddress();
        updateState({
          initialProxyCheck: false,
          proxyAddress,
          startedWithoutProxy: !proxyAddress
        });
      })();
    }
  }, [maker, account]);

  return {
    proxyAddress,
    setupProxy: setupProxy,
    proxyLoading: proxyLoading,
    initialProxyCheck,
    proxyErrors,
    startedWithoutProxy,
    startingBlockHeight,
    proxyDeployed,
    hasProxy: startedWithoutProxy ? proxyDeployed : !!proxyAddress
  };
}
