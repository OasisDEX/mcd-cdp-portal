import { shownFeedGems } from 'references/gems';

export const TOTAL_DEBT = 'totalDebt';
export const BASE_RATE = 'baseRate';
export const GLOBAL_DEBT_CEILING = 'globalDebtCeiling';
export const DEBT_AUCTION_LOT_SIZE = 'debtAuctionLotSize';
export const SURPLUS_AUCTION_LOT_SIZE = 'surplusAuctionLotSize';
export const NUMBER_OF_LIQUIDATIONS = 'numberOfLiquidations';
export const FEED_SET_USD = 'feedSetUSD';
export const FEED_VALUE_USD = 'feedValueUSD';

const defaultFeedState = {
  [FEED_VALUE_USD]: '',
  [FEED_SET_USD]: false
};

const initialState = {
  [BASE_RATE]: '0',
  [TOTAL_DEBT]: '0',
  [GLOBAL_DEBT_CEILING]: '0',
  [DEBT_AUCTION_LOT_SIZE]: '0',
  [NUMBER_OF_LIQUIDATIONS]: '0',
  [SURPLUS_AUCTION_LOT_SIZE]: '0',
  feeds: shownFeedGems().map(gem => ({
    gem: gem.key,
    symbol: gem.symbol,
    ...defaultFeedState
  }))
};

export function getAllFeeds(state) {
  return state.network.system.feeds.reduce((acc, feed) => {
    // this will get usd feeds only
    if (!feed[FEED_VALUE_USD]) return acc;
    return acc.concat({
      pair: `${[feed.symbol]}/USD`,
      value: feed[FEED_VALUE_USD]
    });
  }, []);
}

export default function system(state = initialState, action) {
  const { value, type } = action;
  if (type === 'CLEAR_CONTRACT_STATE') return initialState;
  if (Object.keys(initialState).includes(type))
    return { ...state, [type]: value };

  // example type: ETH.debtCeiling
  const [key, valueType] = type.split('.');

  if (valueType === FEED_VALUE_USD) {
    // the feed value is keyed off of gem so we can mix it into all ilks that share that gem
    return {
      ...state,
      feeds: state.feeds.map(feed =>
        feed.gem === key ? { ...feed, [valueType]: value } : feed
      )
    };
  }
  return state;
}
