import { FEED_VALUE_USD } from '../multicall/feeds';
import values from 'lodash/values';
import uniqBy from 'lodash/uniqBy';

export default function getPrices(store) {
  const prices = uniqBy(values(store.ilks), 'gem').reduce((acc, ilk) => {
    if (!ilk[FEED_VALUE_USD]) return acc;
    return acc.concat({
      pair: `${[ilk.gem]}/USD`,
      value: ilk[FEED_VALUE_USD]
    });
  }, []);

  /* Mocking extra feed data */
  const testPrices = [...prices, ...prices, ...prices, ...prices].map(
    (feed, idx) => {
      if (idx < 2) return feed;
      return { pair: `DUM${idx - 1}/USD`, value: feed.value };
    }
  );

  return testPrices;
}
