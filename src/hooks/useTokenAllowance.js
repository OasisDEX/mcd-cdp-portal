import { useMemo, useState } from 'react';

import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import useActionState from 'hooks/useActionState';
import useLanguage from 'hooks/useLanguage';
import { cleanSymbol } from '../utils/ui';
import { watch } from 'hooks/useObservable';
import BigNumber from 'bignumber.js';

export function useTokenAllowances() {
  const { account } = useMaker();
  const [{ accounts }] = useStore();
  const allowances = useMemo(() => {
    return account
      ? {
          ...((accounts &&
            accounts[account.address] &&
            accounts[account.address].allowances) ||
            {}),
          ETH: true
        }
      : {
          ETH: true
        };
  }, [account, accounts]);
  return allowances;
}

export function useFetchedTokenAllowances() {
  const { account } = useMaker();
  const [{ accounts }] = useStore();

  const allowancesFetched = useMemo(() => {
    if (!account) return false;
    return !!(
      accounts &&
      accounts[account.address] &&
      accounts[account.address].allowances
    );
  }, [account, accounts]);
  return allowancesFetched;
}

export default function useTokenAllowance(tokenSymbol) {
  const { lang } = useLanguage();
  const { maker, account, newTxListener } = useMaker();

  const proxyAddress = watch.proxyAddress(account?.address, true);
  const allowance = watch.tokenAllowance(
    account?.address,
    proxyAddress || undefined,
    tokenSymbol
  );

  const hasFetchedAllowance = proxyAddress === null || allowance !== undefined;
  const token = maker.getToken(tokenSymbol);
  const hasAllowance =
    allowance !== undefined && allowance !== null && !allowance.eq(0);

  const hasSufficientAllowance = value =>
    BigNumber(value).isLessThanOrEqualTo(allowance);

  const [startedWithoutAllowance, setStartedWithoutAllowance] = useState(false);
  const [setAllowance, allowanceLoading, , allowanceErrors] = useActionState(
    async () => {
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
