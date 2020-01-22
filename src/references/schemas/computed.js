/* eslint-disable */
import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import { getCurrency } from 'utils/cdp';
import flatten from 'lodash/flatten';
import zipWith from 'lodash/zipWith';

// -----------------------------------------------------------------------------
// Computed Observables
// -----------------------------------------------------------------------------

export const ilkPrice = {
  generate: ilkName => ({
    dependencies: [
      ['refPerDai'],
      ['priceWithSafetyMargin', ilkName],
      ['liquidationRatio', ilkName]
    ],
    computed: (refPerDai, priceWithSafetyMargin, liquidationRatio) => {
      const price = math.price(
        getCurrency({ ilk: ilkName }),
        refPerDai,
        priceWithSafetyMargin,
        math.liquidationRatio(liquidationRatio)
      );
      return price;
    }
  })
};

export const ilkPrices = {
  generate: (ilkNames) => ({
    // Dynamically generate dependencies
    dependencies: () => [
      ['refPerDai'],
      ...flatten(
        ilkNames.map(ilkName => [
          ['priceWithSafetyMargin', ilkName],
          ['liquidationRatio', ilkName]
        ])
      )
    ],
    computed: (...results) => {
      // TODO: Improve this - lodash function we could use to group?
      const refPerDai = results[0];
      const prices = [];
      results = results.slice(1);
      for(let i = 0, j = 0; i < results.length; i += 2, j++) {
        console.log('hmmmm', results[i]);
        prices.push(math.price(
            getCurrency({ ilk: ilkNames[j] }),
            refPerDai,
            results[i],
            math.liquidationRatio(results[i + 1])
          ));
      }
      return prices
    }
  })
};

export const getVaults = {
  generate: (manager, proxy) => ({
    dependencies: [
      ['cdpIds', manager, proxy],
      ['cdpUrns', manager, proxy],
      ['cdpIlks', manager, proxy]
    ],
    computed: (cdpIds, cdpUrns, cdpIlks) => zipWith(cdpIds, cdpUrns, cdpIlks, (id, urn, ilk) => ({ id, urn, ilk }))
  })
};

export default {
  ilkPrice,
  ilkPrices,
  getVaults
};
