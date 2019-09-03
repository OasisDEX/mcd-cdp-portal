import { useState, useEffect } from 'react';
import lang from 'languages';

import useActionState from 'hooks/useActionState';
import useMaker from 'hooks/useMaker';

export default function useProxy() {
  const { maker, account, newTxListener } = useMaker();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [proxyAddress, setProxyAddress] = useState(undefined);
  const [startedWithoutProxy, setStartedWithoutProxy] = useState(false);
  const [setupProxy, proxyLoading, , proxyErrors] = useActionState(async () => {
    if (!account) return null;
    if (proxyAddress) return proxyAddress;
    const txPromise = maker
      .service('proxy')
      .ensureProxy()
      .then(address => {
        setProxyAddress(address);
      });
    setStartedWithoutProxy(true);
    newTxListener(txPromise, lang.transactions.setting_up_proxy);
    return await txPromise;
  });

  useEffect(() => {
    (async () => {
      setIsFirstLoading(true);
      const proxyAddress = await maker.service('proxy').getProxyAddress();
      setIsFirstLoading(false);

      setProxyAddress(proxyAddress);
    })();
  }, [maker, account]);

  return {
    proxyAddress,
    setupProxy,
    proxyLoading: proxyLoading || isFirstLoading,
    proxyErrors,
    startedWithoutProxy
  };
}
