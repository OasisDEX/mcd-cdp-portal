import {
  TOTAL_DEBT,
  BASE_RATE,
  GLOBAL_DEBT_CEILING,
  DEBT_AUCTION_LOT_SIZE,
  SURPLUS_AUCTION_LOT_SIZE,
  PAR,
  TOTAL_SAVINGS_DAI
} from 'reducers/system';

const totalDebt = addresses => ({
  target: addresses.MCD_VAT,
  call: ['debt()(uint256)'],
  returns: [[`system.${TOTAL_DEBT}`]]
});

const baseRate = addresses => ({
  target: addresses.MCD_JUG,
  call: ['base()(uint256)'],
  returns: [[`system.${BASE_RATE}`]]
});

const globalDebtCeiling = addresses => ({
  target: addresses.MCD_VAT,
  call: ['Line()(uint256)'],
  returns: [[`system.${GLOBAL_DEBT_CEILING}`]]
});

const debtAuctionLotSize = addresses => ({
  target: addresses.MCD_VOW,
  call: ['sump()(uint256)'],
  returns: [[`system.${DEBT_AUCTION_LOT_SIZE}`]]
});

const surplusAuctionLotSize = addresses => ({
  target: addresses.MCD_VOW,
  call: ['bump()(uint256)'],
  returns: [[`system.${SURPLUS_AUCTION_LOT_SIZE}`]]
});

const par = addresses => ({
  target: addresses.MCD_SPOT,
  call: ['par()(uint256)'],
  returns: [[`system.${PAR}`]]
});

const totalSavingsDai = addresses => ({
  target: addresses.MCD_POT,
  call: ['Pie()(uint256)'],
  returns: [[`system.${TOTAL_SAVINGS_DAI}`]]
});

export function createCDPSystemModel(addresses) {
  return [
    totalDebt,
    baseRate,
    globalDebtCeiling,
    debtAuctionLotSize,
    surplusAuctionLotSize,
    par,
    totalSavingsDai
  ].map(f => f(addresses));
}
