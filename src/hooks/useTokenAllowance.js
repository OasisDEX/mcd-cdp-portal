import { useState } from 'react';

import useMaker from 'hooks/useMaker';
import useActionState from 'hooks/useActionState';
import useLanguage from 'hooks/useLanguage';
import { cleanSymbol } from '../utils/ui';
import { watch } from 'hooks/useObservable';
import BigNumber from 'bignumber.js';

export default function useTokenAllowance(tokenSymbol) {
  const { lang } = useLanguage();
  const { maker, account, newTxListener } = useMaker();

  const proxyAddress = watch.proxyAddress(account?.address);
  const allowance = watch.tokenAllowance(
    account?.address,
    proxyAddress || undefined,
    tokenSymbol
  );

  const hasFetchedAllowance = proxyAddress === null || allowance !== undefined;
  const hasAllowance =
    allowance !== undefined && allowance !== null && !allowance.eq(0);

  const hasSufficientAllowance = value =>
    BigNumber(value).isLessThanOrEqualTo(allowance);

  const [startedWithoutAllowance, setStartedWithoutAllowance] = useState(false);
  const [setAllowance, allowanceLoading, , allowanceErrors] = useActionState(
    async () => {
      const token = maker.getToken(tokenSymbol);
      const proxyAddress = await maker.service('proxy').getProxyAddress();
      const txPromise = token.approveUnlimited(proxyAddress);
      setStartedWithoutAllowance(true);
      newTxListener(
        txPromise,
        lang.formatString(
          lang.transactions.unlocking_token,
          cleanSymbol(tokenSymbol)
        )
      );
      return await txPromise;
    }
  );

  return {
    hasAllowance,
    hasFetchedAllowance,
    setAllowance,
    allowanceLoading,
    allowanceErrors,
    startedWithoutAllowance,
    allowance,
    hasSufficientAllowance
  };
}
