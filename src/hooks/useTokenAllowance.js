import { useCallback, useMemo } from 'react';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';

export function useTokenAllowances() {
  const { account } = useMaker();
  const [{ accounts }] = useStore();
  const allowances = useMemo(() => {
    return account
      ? {
          ...accounts[account.address].allowances,
          ETH: true
        }
      : { ETH: true };
  }, [account, accounts]);

  return allowances;
}

export default function useTokenAllowance(tokenSymbol) {
  const { maker } = useMaker();
  const token = maker.getToken(tokenSymbol);
  const allowances = useTokenAllowances();
  const hasAllowance = allowances[tokenSymbol];

  const setAllowance = useCallback(async () => {
    const proxyAddress = await maker.service('proxy').getProxyAddress();
    return await token.approveUnlimited(proxyAddress);
  }, [token]);

  return [hasAllowance, setAllowance];
}
