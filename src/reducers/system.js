import produce from 'immer';
import { DAI } from '../maker';
import { fromRad } from 'utils/units';

export const TOTAL_DEBT = 'totalDebt';
export const BASE_RATE = 'baseRate';
export const GLOBAL_DEBT_CEILING = 'globalDebtCeiling';
export const DEBT_AUCTION_LOT_SIZE = 'debtAuctionLotSize';
export const SURPLUS_AUCTION_LOT_SIZE = 'surplusAuctionLotSize';
export const NUMBER_OF_LIQUIDATIONS = 'numberOfLiquidations';
export const PAR = 'par';

export const initialState = {};

function convert(valueType, value) {
  switch (valueType) {
    default:
      return value;
  }
}

const reducer = produce((draft, { type, value }) => {
  if (!type) return;
  if (type === 'CLEAR_CONTRACT_STATE') return initialState;
  const [label, valueType] = type.split('.');
  if (label === 'system') draft[valueType] = convert(valueType, value);
}, initialState);

export default reducer;
