import produce from 'immer';

export const TOTAL_DEBT = 'totalDebt';
export const BASE_RATE = 'baseRate';
export const GLOBAL_DEBT_CEILING = 'globalDebtCeiling';
export const DEBT_AUCTION_LOT_SIZE = 'debtAuctionLotSize';
export const SURPLUS_AUCTION_LOT_SIZE = 'surplusAuctionLotSize';
export const NUMBER_OF_LIQUIDATIONS = 'numberOfLiquidations';

export const initialState = {
  [BASE_RATE]: '0',
  [TOTAL_DEBT]: '0',
  [GLOBAL_DEBT_CEILING]: '0',
  [DEBT_AUCTION_LOT_SIZE]: '0',
  [NUMBER_OF_LIQUIDATIONS]: '0',
  [SURPLUS_AUCTION_LOT_SIZE]: '0'
};

const reducer = produce((draft, { type, value }) => {
  if (!type) return;
  if (type === 'CLEAR_CONTRACT_STATE') return initialState;
  const [label, valueType] = type.split('.');
  if (label === 'system') draft[valueType] = value;
}, initialState);

export default reducer;
