import { DAI } from 'maker';
import { fromRad } from 'utils/units';

export const TOTAL_DEBT = 'totalDebt';
export const BASE_RATE = 'baseRate';
export const GLOBAL_DEBT_CEILING = 'globalDebtCeiling';
export const DEBT_AUCTION_LOT_SIZE = 'debtAuctionLotSize';
export const SURPLUS_AUCTION_LOT_SIZE = 'surplusAuctionLotSize';
export const NUMBER_OF_LIQUIDATIONS = 'numberOfLiquidations';

const totalDebt = addresses => ({
  target: addresses.MCD_VAT,
  call: ['debt()(uint256)'],
  returns: [[`system.${TOTAL_DEBT}`, val => DAI.rad(val)]]
});

const baseRate = addresses => ({
  target: addresses.MCD_JUG,
  call: ['base()(uint256)'],
  returns: [[`system.${BASE_RATE}`]]
});

const globalDebtCeiling = addresses => ({
  target: addresses.MCD_VAT,
  call: ['Line()(uint256)'],
  returns: [[`system.${GLOBAL_DEBT_CEILING}`, val => fromRad(val)]]
});

const debtAuctionLotSize = addresses => ({
  target: addresses.MCD_VOW,
  call: ['sump()(uint256)'],
  returns: [[`system.${DEBT_AUCTION_LOT_SIZE}`, val => DAI.rad(val)]]
});

const surplusAuctionLotSize = addresses => ({
  target: addresses.MCD_VOW,
  call: ['bump()(uint256)'],
  returns: [[`system.${SURPLUS_AUCTION_LOT_SIZE}`, val => DAI.rad(val)]]
});

const par = addresses => ({
  target: addresses.MCD_SPOT,
  call: ['par()(uint256)'],
  returns: [['system.par']]
});

export function createCDPSystemModel(addresses) {
  return [
    totalDebt,
    baseRate,
    globalDebtCeiling,
    debtAuctionLotSize,
    surplusAuctionLotSize,
    par
  ].map(f => f(addresses));
}
