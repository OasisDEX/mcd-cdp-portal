import produce from 'immer';
import ilkList from 'references/ilkList';
import uniqBy from 'lodash/uniqBy';

export const FEED_SET_USD = 'feedSetUSD';
export const FEED_VALUE_USD = 'feedValueUSD';
export const RATE = 'rate';
export const ILK_RATE = 'ilkRate';
export const LAST_DRIP = 'lastDrip';
export const PRICE_WITH_SAFETY_MARGIN = 'priceWithSafetyMargin';
export const DEBT_CEILING = 'debtCeiling';
export const LIQUIDATION_RATIO = 'liquidationRatio';
export const LIQUIDATOR_ADDRESS = 'liquidatorAddress';
export const LIQUIDATION_PENALTY = 'liquidationPenalty';
export const MAX_AUCTION_LOT_SIZE = 'maxAuctionLotSize';
export const ADAPTER_BALANCE = 'adapterBalance';

const defaultIlkState = {
  [RATE]: '',
  [ILK_RATE]: '',
  [LAST_DRIP]: '',
  [FEED_VALUE_USD]: '',
  [DEBT_CEILING]: '',
  [ADAPTER_BALANCE]: '',
  [LIQUIDATION_RATIO]: '',
  [FEED_SET_USD]: false,
  [LIQUIDATOR_ADDRESS]: '',
  [LIQUIDATION_PENALTY]: '',
  [MAX_AUCTION_LOT_SIZE]: '',
  [PRICE_WITH_SAFETY_MARGIN]: ''
};

export function getIlkData(feeds, ilkKey) {
  if (!feeds) return {};
  const ilkData = feeds.find(({ key }) => ilkKey === key);
  if (!ilkData) return {};
  return {
    ...ilkData,
    price: ilkData[FEED_VALUE_USD],
    liquidationRatio: ilkData[LIQUIDATION_RATIO],
    liquidationPenalty: ilkData[LIQUIDATION_PENALTY],
    ilkRate: ilkData[ILK_RATE],
    stabilityFee: ilkData[RATE]
  };
}

export function getAllFeeds(feeds) {
  return uniqBy(feeds, 'gem').reduce((acc, cdpType) => {
    // this will get usd feeds only
    if (!cdpType[FEED_VALUE_USD]) return acc;
    return acc.concat({
      pair: `${[cdpType.currency.symbol]}/USD`,
      value: cdpType[FEED_VALUE_USD]
    });
  }, []);
}

const initialState = ilkList.map(ilk => ({ ...ilk, ...defaultIlkState }));

const reducer = produce((draft, { type, value }) => {
  if (!type) return;
  if (type === 'CLEAR_CONTRACT_STATE') return initialState;
  // example type: ETH.debtCeiling
  const [key, valueType] = type.split('.');
  if (defaultIlkState.hasOwnProperty(valueType)) {
    if (valueType === FEED_VALUE_USD) {
      // the feed value is keyed off of gem so we can mix it into all ilks that share that gem
      draft.forEach(ilkData => {
        if (ilkData.gem === key) ilkData[valueType] = value;
      });
    } else {
      const idx = draft.findIndex(({ key: ilkKey }) => ilkKey === key);
      draft[idx] = { ...draft[idx], [valueType]: value };
    }
  }
}, initialState);

export default reducer;
