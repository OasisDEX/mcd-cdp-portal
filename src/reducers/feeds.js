import produce from 'immer';
import ilkList from 'references/ilkList';
import uniqBy from 'lodash/uniqBy';
import BigNumber from 'bignumber.js';
import { fromRay, fromRad, fromDecimals, RAY } from 'utils/units';

export const FEED_SET_USD = 'feedSetUSD';
export const FEED_VALUE_USD = 'feedValueUSD';
export const DUTY = 'duty'; // this is ilk.duty in jug.sol
export const RATE = 'rate';
export const LAST_DRIP = 'lastDrip';
export const PRICE_WITH_SAFETY_MARGIN = 'priceWithSafetyMargin';
export const DEBT_CEILING = 'debtCeiling';
export const LIQUIDATION_RATIO = 'liquidationRatio';
export const LIQUIDATOR_ADDRESS = 'liquidatorAddress';
export const LIQUIDATION_PENALTY = 'liquidationPenalty';
export const MAX_AUCTION_LOT_SIZE = 'maxAuctionLotSize';
export const ADAPTER_BALANCE = 'adapterBalance';
export const ILK_ART = 'ilkArt';
export const ILK_DEBT_AVAILABLE = 'ilkDebtAvailable';
export const DUST = 'dust';

const defaultIlkState = {
  [DUTY]: '',
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
  [PRICE_WITH_SAFETY_MARGIN]: '',
  [ILK_ART]: '',
  [ILK_DEBT_AVAILABLE]: '',
  [DUST]: ''
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
    rate: ilkData[RATE],
    stabilityFee: ilkData[DUTY],
    ilkDebtAvailable: ilkData[ILK_DEBT_AVAILABLE]
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

export const initialState = ilkList.map(ilk => ({
  ...ilk,
  ...defaultIlkState
}));

function convert(valueType, value, decimals) {
  switch (valueType) {
    case DUTY: {
      const taxBigNumber = new BigNumber(value.toString()).dividedBy(RAY);
      const secondsPerYear = 60 * 60 * 24 * 365;
      BigNumber.config({ POW_PRECISION: 100 });
      return taxBigNumber
        .pow(secondsPerYear)
        .minus(1)
        .times(100)
        .toFixed(3);
    }
    case RATE:
    case PRICE_WITH_SAFETY_MARGIN:
      return fromRay(value).toFixed(3);
    case DEBT_CEILING:
    case DUST:
      return fromRad(value).toFixed(0);
    case MAX_AUCTION_LOT_SIZE:
    case ADAPTER_BALANCE:
      return fromDecimals(value, decimals).toFixed(5);
    case LIQUIDATION_RATIO:
      return fromRay(value)
        .times(100)
        .toFixed(0);
    case LIQUIDATION_PENALTY:
      return fromRay(new BigNumber(value).minus(RAY).times(100)).toFixed(2);
    default:
      return value;
  }
}

const reducer = produce((draft, { type, value }) => {
  if (!type) return;
  if (type === 'CLEAR_CONTRACT_STATE') return initialState;
  // example type: ETH.debtCeiling
  const [label, key, valueType] = type.split('.');
  const ilk = ilkList.find(i => i.key === key);
  let decimals = 18;
  if (ilk && ilk.decimals) decimals = ilk.decimals;
  if (label === 'ilk') {
    draft.find(f => f.key === key)[valueType] = convert(
      valueType,
      value,
      decimals
    );
  }
}, initialState);

export default reducer;
