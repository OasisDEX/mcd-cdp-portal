import ilkList from 'references/ilkList';
import { getUnique } from 'utils/ui';

export const FEED_SET_USD = 'feedSetUSD';
export const FEED_VALUE_USD = 'feedValueUSD';
export const RATE = 'rate';
export const LAST_DRIP = 'lastDrip';
export const PRICE_WITH_SAFETY_MARGIN = 'priceWithSafetyMargin';
export const DEBT_CEILING = 'debtCeiling';
export const LIQUIDATION_RATIO = 'liquidationRatio';
export const LIQUIDATOR_ADDRESS = 'liquidatorAddress';
export const LIQUIDATION_PENALTY = 'liquidationPenalty';
export const MAX_AUCTION_LOT_SIZE = 'maxAuctionLotSize';
export const ADAPTER_BALANCE = 'adapterBalance';

export function getIlkData(state, ilkKey) {
  return state.network.cdpTypes.find(({ key }) => ilkKey === key) || {};
}

export function getAllFeeds(state) {
  return getUnique(state.network.cdpTypes, 'gem').reduce((acc, cdpType) => {
    // this will get usd feeds only
    if (!cdpType[FEED_VALUE_USD]) return acc;
    return acc.concat({
      pair: `${[cdpType.currency.symbol]}/USD`,
      value: cdpType[FEED_VALUE_USD]
    });
  }, []);
}

const defaultIlkState = {
  [RATE]: '',
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

const initialState = ilkList.map(ilk => ({ ...ilk, ...defaultIlkState }));

function cdpTypes(state = initialState, action) {
  const { value, type } = action;

  if (type === 'CLEAR_CONTRACT_STATE') return initialState;

  // example type: ETH.debtCeiling
  const [key, valueType] = type.split('.');

  if (Object.keys(defaultIlkState).includes(valueType)) {
    if (valueType === FEED_VALUE_USD) {
      // the feed value is keyed off of gem so we can mix it into all ilks that share that gem
      return state.map(ilkData =>
        ilkData.gem === key ? { ...ilkData, [valueType]: value } : ilkData
      );
    } else {
      const idx = state.findIndex(({ key: ilkKey }) => ilkKey === key);
      state[idx] = { ...state[idx], [valueType]: value };
      return [...state];
    }
  }

  return state;
}

export default cdpTypes;
