import produce from 'immer';
import ilkList from 'references/ilkList';
import uniqBy from 'lodash/uniqBy';
import { price } from '@makerdao/dai-plugin-mcd/dist/math';

export const FEED_SET_USD = 'feedSetUSD';
export const FEED_VALUE_USD = 'feedValueUSD';
export const DUTY = 'duty';
export const RATE = 'rate';
export const LAST_DRIP = 'lastDrip';
export const SPOT = 'spot';
export const DEBT_CEILING = 'debtCeiling';
export const LIQUIDATION_RATIO = 'liquidationRatio';
export const LIQUIDATOR_ADDRESS = 'liquidatorAddress';
export const LIQUIDATION_PENALTY = 'liquidationPenalty';
export const MAX_AUCTION_LOT_SIZE = 'maxAuctionLotSize';
export const ADAPTER_BALANCE = 'adapterBalance';

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
  [SPOT]: ''
};

const priceFactors = [SPOT, LIQUIDATION_RATIO, 'par'];

export function getIlkData(feeds, ilkKey) {
  if (!feeds) return {};
  const ilkData = feeds.find(({ key }) => ilkKey === key);
  if (!ilkData) return {};
  return {
    ...ilkData,
    price: ilkData[FEED_VALUE_USD],
    liquidationRatio: ilkData[LIQUIDATION_RATIO],
    liquidationPenalty: ilkData[LIQUIDATION_PENALTY],
    ilkRate: ilkData[RATE],
    stabilityFee: ilkData[DUTY]
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

  if (type === 'par') {
    draft.forEach(ilk => {
      ilk.par = value;
    });
  }

  const [key, valueType] = type.split('.');
  if (defaultIlkState.hasOwnProperty(valueType)) {
    const idx = draft.findIndex(({ key: ilkKey }) => ilkKey === key);
    draft[idx] = { ...draft[idx], [valueType]: value };
  }

  // recalculate price
  if (priceFactors.includes(valueType)) {
    draft.forEach(ilk => {
      if (ilk.key === key && priceFactors.every(f => ilk[f])) {
        const newPrice = price(
          ilkList.find(i => i.key === key).currency,
          ilk.par,
          ilk[SPOT],
          ilk[LIQUIDATION_RATIO]
        );
        ilk[FEED_VALUE_USD] = newPrice;
        console.log(
          `set new price ${newPrice} for ${ilk.key} due to change in ${type}`
        );
      }
    });
  }
}, initialState);

export default reducer;
