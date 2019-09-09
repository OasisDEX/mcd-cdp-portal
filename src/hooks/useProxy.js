import { useReducer, useEffect } from 'react';
import lang from 'languages';

import useActionState from 'hooks/useActionState';
import useBlockHeight from 'hooks/useBlockHeight';
import useMaker from 'hooks/useMaker';
import { updateWatcherWithProxy } from '../watch';

const initialState = {
  isFirstLoading: true,
  startingBlockHeight: 0,
  proxyAddress: undefined,
  startedWithoutProxy: false,
  proxyDeployed: false
};

export default function useProxy() {
  const { maker, account, newTxListener } = useMaker();
  const blockHeight = useBlockHeight(0);

  const [
    {
      isFirstLoading,
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
    updateState({ startedWithoutProxy: true });
    const address = await txPromise;

    updateState({
      startingBlockHeight: blockHeight,
      proxyAddress: address
    });

    await updateWatcherWithProxy(maker, account.address, address);
    await maker.service('transactionManager').confirm(txPromise, 7);

    updateState({ proxyDeployed: true });
    newTxListener(txPromise, lang.transactions.setting_up_proxy);
    return address;
  });

  useEffect(() => {
    (async () => {
      updateState({ isFirstLoading: true });
      const proxyAddress = await maker.service('proxy').getProxyAddress();
      updateState({
        isFirstLoading: false,
        proxyAddress
      });
    })();
  }, [maker, account]);

  return {
    proxyAddress,
    setupProxy,
    proxyLoading: proxyLoading || isFirstLoading,
    proxyErrors,
    startedWithoutProxy,
    startingBlockHeight,
    proxyDeployed
  };
}
