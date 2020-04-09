import { useEffect, useState, useRef } from 'react';
import { pollTokenPrices } from 'utils/ethereum';
import useInterval from 'hooks/useInterval';
import useMaker from 'hooks/useMaker';

function useOraclePrices({ gem, interval = 5 * 1000 }) {
  const [prices, setPrices] = useState({
    currentPrice: null,
    nextPrice: null
  });
  const { maker } = useMaker();

  const isValidNetwork = ['mainnet', 'kovan', 'kovan-osm'].some(
    network => network === maker.service('web3').networkName
  );

  const isCancelled = useRef(false);
  useInterval(async () => {
    if (!isValidNetwork) return;
    if (isCancelled.current) return;
    const { currentPrice, nextPrice } = await pollTokenPrices(maker, gem);
    if (isCancelled.current) return;
    setPrices({
      currentPrice,
      nextPrice
    });
  }, interval);

  // useEffect necessary as useInterval hooks does not perform fetch immediately
  useEffect(() => {
    if (!isValidNetwork) return;
    (async () => {
      if (isCancelled.current) return;
      const { currentPrice, nextPrice } = await pollTokenPrices(maker, gem);
      if (isCancelled.current) return;
      setPrices({
        currentPrice,
        nextPrice
      });
    })();
    return () => (isCancelled.current = true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return prices;
}

export default useOraclePrices;
