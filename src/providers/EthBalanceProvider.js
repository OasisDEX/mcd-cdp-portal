import { useEffect } from 'react';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import useBlockHeight from 'hooks/useBlockHeight';
import { fromWei } from 'utils/units';

function EthBalanceProvider({ children }) {
  const { maker, account } = useMaker();
  const [, dispatch] = useStore();
  const blockHeight = useBlockHeight();

  let isCancelled = false;
  useEffect(() => {
    if (!account || !maker) return;
    (async () => {
      const ethBalance = await maker
        .service('web3')
        .getBalance(account.address);
      if (isCancelled) return;
      dispatch({
        type: `accounts.${account.address}.balances.ETH`,
        value: fromWei(ethBalance)
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => (isCancelled = true);
  }, [maker, dispatch, account, blockHeight]);

  return children;
}

export default EthBalanceProvider;
