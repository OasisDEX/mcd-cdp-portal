import cdpTypesConfig from 'references/cdpTypes';

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

export function getIlkData(state, cdpTypeSlug) {
  return state.network.cdpTypes.find(({ slug }) => cdpTypeSlug === slug) || {};
}

export function getAllFeeds(state) {
  return state.network.cdpTypes.reduce((acc, cdpType) => {
    // this will get usd feeds only
    if (!cdpType[FEED_VALUE_USD]) return acc;
    return acc.concat({
      pair: `${[cdpType.symbol]}/USD`,
      value: cdpType[FEED_VALUE_USD]
    });
  }, []);
}

const defaultCDPTypeState = {
  key: '',
  slug: '',
  symbol: '',
  [RATE]: '0',
  [LAST_DRIP]: '0',
  [FEED_VALUE_USD]: '0',
  [DEBT_CEILING]: '0',
  [ADAPTER_BALANCE]: '0',
  [LIQUIDATION_RATIO]: '0',
  [FEED_SET_USD]: false,
  [LIQUIDATOR_ADDRESS]: '',
  [LIQUIDATION_PENALTY]: '0',
  [MAX_AUCTION_LOT_SIZE]: '0',
  [PRICE_WITH_SAFETY_MARGIN]: '0'
};

const initialState = [];

function cdpTypes(state = initialState, action) {
  const { value, type } = action;

  if (type === 'CLEAR_CONTRACT_STATE') return initialState;

  // example type: ETH.debtCeiling
  const [cdpTypeKey, valueType] = type.split('.');

  if (Object.keys(defaultCDPTypeState).includes(valueType)) {
    const cdpState = state.find(({ key }) => key === cdpTypeKey);

    // is this a new cdp type?
    if (cdpState === undefined) {
      // then grab the relevant config
      const cdpTypeConfig = cdpTypesConfig.find(
        ({ key }) => cdpTypeKey === key
      );
      return state.concat({
        ...defaultCDPTypeState,
        ...cdpTypeConfig,
        [valueType]: value
      });
    } else {
      const idx = state.findIndex(({ key }) => key === cdpTypeKey);
      state[idx] = { ...state[idx], [valueType]: value };
      return [...state];
    }
  }

  return state;
}

export default cdpTypes;
