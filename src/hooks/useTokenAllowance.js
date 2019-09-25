import { useMemo, useState } from 'react';

import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import useActionState from 'hooks/useActionState';
import useLanguage from 'hooks/useLanguage';

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
      : { ETH: true };
  }, [account, accounts]);

  return allowances;
}

export default function useTokenAllowance(tokenSymbol) {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const token = maker.getToken(tokenSymbol);
  const allowances = useTokenAllowances();
  const hasAllowance = !!allowances[tokenSymbol];

  const [startedWithoutAllowance, setStartedWithoutAllowance] = useState(false);
  const [setAllowance, allowanceLoading, , allowanceErrors] = useActionState(
    async () => {
      const proxyAddress = await maker.service('proxy').getProxyAddress();
      const txPromise = token.approveUnlimited(proxyAddress);
      setStartedWithoutAllowance(true);
      newTxListener(
        txPromise,
        lang.formatString(lang.transactions.unlocking_token, tokenSymbol)
      );
      return await txPromise;
    }
  );

  return {
    hasAllowance,
    setAllowance,
    allowanceLoading,
    allowanceErrors,
    startedWithoutAllowance
  };
}
