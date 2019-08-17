import { useState, useEffect, useMemo } from 'react';
import useMaker from 'hooks/useMaker';
import uniqBy from 'lodash/uniqBy';

const useFeeds = () => {
  const { maker } = useMaker();
  const [cdpTypes, setCdpTypes] = useState([]);

  // TODO: Hook into CdpTypeService price updates via SDK
  useEffect(() => {
    (async () => {
      const types = maker.service('mcd:cdpType').cdpTypes;
      console.debug('[useFeeds] Awaiting prefetch');
      await Promise.all(types.map(type => type.prefetch()));
      console.debug('[useFeeds] Got types:', types);
      setCdpTypes(types);
    })();
  }, [maker]);

  const uniqueUsdFeeds = useMemo(() => {
    return uniqBy(cdpTypes, 'price.symbol').reduce((acc, cdpType) => {
      if (cdpType.price.numerator.symbol !== 'USD') return acc;
      return acc.concat({
        pair: cdpType.price.symbol,
        value: cdpType.price
      });
    }, []);
  }, [cdpTypes]);

  return uniqueUsdFeeds;
};

export default useFeeds;
