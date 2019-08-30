import { useEffect, useState, useCallback } from 'react';
import useMaker from 'hooks/useMaker';
import { MAX_UINT_BN } from 'utils/units';

export default function useTokenAllowance(tokenSymbol) {
  const { maker, account } = useMaker();
  const token = maker.getToken(tokenSymbol);
  const [hasAllowance, setHasAllowance] = useState(true);
  const [startedWithoutAllowance, setStartedWithoutAllowance] = useState(false);

  const checkAllowance = useCallback(async () => {
    try {
      const proxyAddress = await maker.service('proxy').getProxyAddress();
      const hasAllowance =
        tokenSymbol === 'ETH' ||
        (proxyAddress &&
          (await token.allowance(maker.currentAddress(), proxyAddress)).eq(
            MAX_UINT_BN
          ));
      return hasAllowance;
    } catch (err) {
      return false;
    }
  }, [maker]);

  useEffect(() => {
    checkAllowance().then(hasAllowance => {
      setStartedWithoutAllowance(!hasAllowance);
    });
  }, [checkAllowance, account]);

  useEffect(() => {
    checkAllowance().then(hasAllowance => {
      setHasAllowance(hasAllowance);
    });
  }, [maker, account]);

  const setAllowance = useCallback(async () => {
    const proxyAddress = await maker.service('proxy').getProxyAddress();
    return await token.approveUnlimited(proxyAddress).then(() => {
      setHasAllowance(true);
    });
  }, [token, setHasAllowance]);

  return [hasAllowance, setAllowance, startedWithoutAllowance];
}
