import { useEffect, useState } from 'react';
import useActionState from 'hooks/useActionState';
import useBlockHeight from 'hooks/useBlockHeight';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { watch } from 'hooks/useObservable';
import usePrevious from 'hooks/usePrevious';
import debug from 'debug';
const log = debug('maker:useProxy');

export default function useProxy() {
  const { lang } = useLanguage();
  const { maker, account, newTxListener } = useMaker();
  const blockHeight = useBlockHeight(0);
  const [startedWithoutProxy, setStartedWithoutProxy] = useState(false);
  const [startingBlockHeight, setStartingBlockHeight] = useState(0);
  const [proxyDeployed, setProxyDeployed] = useState(false);

  let proxyAddress = watch.proxyAddress(account?.address);
  proxyAddress =
    proxyAddress === '0x0000000000000000000000000000000000000000'
      ? null
      : proxyAddress;

  const prevProxy = usePrevious(proxyAddress);

  useEffect(() => {
    if (prevProxy === undefined && proxyAddress === null) {
      setStartedWithoutProxy(true);
    }
  }, [proxyAddress, prevProxy]);

  const [setupProxy, proxyLoading, , proxyErrors] = useActionState(async () => {
    log('proxy setup is running');
    if (!account) return null;
    if (proxyAddress) return proxyAddress;

    const txPromise = maker.service('proxy').ensureProxy();
    newTxListener(txPromise, lang.transactions.setting_up_proxy);
    setStartingBlockHeight(blockHeight);
    await maker.service('transactionManager').confirm(txPromise, 7);
    setProxyDeployed(true);
  });
  return {
    proxyAddress,
    startedWithoutProxy,
    setupProxy,
    proxyLoading,
    initialProxyCheck: proxyAddress === undefined,
    proxyErrors,
    startingBlockHeight,
    proxyDeployed,
    hasProxy: startedWithoutProxy ? proxyDeployed : !!proxyAddress
  };
}
