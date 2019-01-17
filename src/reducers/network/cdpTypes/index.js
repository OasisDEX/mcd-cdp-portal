import cdpTypesConfig from 'references/cdpTypes';

export const FEED_LIVENESS = 'feedLiveness';
export const FEED_VALUE = 'feedValue';
export const RATE = 'rate';
export const LAST_DRIP = 'lastDrip';
export const PRICE_WITH_SAFETY_MARGIN = 'priceWithSafetyMargin';
export const DEBT_CEILING = 'debtCeiling';
export const LIQUIDATION_RATIO = 'liquidationRatio';
export const LIQUIDATOR_ADDRESS = 'liquidatorAddress';
export const LIQUIDATION_PENALTY = 'liquidationPenalty';
export const MAX_AUCTION_LOT_SIZE = 'maxAuctionLotSize';
export const ADAPTER_BALANCE = 'adapterBalance';

export function getCDPType(state, cdpTypeSlug) {
  return state.network.cdpTypes.find(({ slug }) => cdpTypeSlug === slug) || {};
}

const defaultCDPTypeState = {
  key: '',
  slug: '',
  [RATE]: '0',
  [LAST_DRIP]: '0',
  [FEED_VALUE]: '0',
  [DEBT_CEILING]: '0',
  [ADAPTER_BALANCE]: '0',
  [LIQUIDATION_RATIO]: '0',
  [FEED_LIVENESS]: false,
  [LIQUIDATOR_ADDRESS]: '',
  [LIQUIDATION_PENALTY]: '0',
  [MAX_AUCTION_LOT_SIZE]: '0',
  [PRICE_WITH_SAFETY_MARGIN]: '0'
};

const initialState = [];

function cdpTypes(state = initialState, action) {
  const { value, type } = action;
  // example type: ETH.debtCeiling
  const [cdpTypeKey, valueType] = type.split('.');

  if (Object.keys(defaultCDPTypeState).includes(valueType)) {
    const cdpState = state.find(({ key }) => key === cdpTypeKey);

    // is this a new cdp type?
    if (cdpState === undefined) {
      // then grab the associated url slug from our config
      const slug = cdpTypesConfig.find(({ key }) => cdpTypeKey === key).slug;
      return state.concat({
        ...defaultCDPTypeState,
        [valueType]: value,
        key: cdpTypeKey,
        slug
      });
    } else {
      const idx = state.findIndex(({ key }) => key === cdpTypeKey);
      state[idx] = { ...state[idx], [valueType]: value };
    }
  }

  return state;
}

export default cdpTypes;
