import { DAI } from 'maker';
import { fromRad } from 'utils/units';
import {
  TOTAL_DEBT,
  BASE_RATE,
  GLOBAL_DEBT_CEILING,
  DEBT_AUCTION_LOT_SIZE,
  SURPLUS_AUCTION_LOT_SIZE,
  NUMBER_OF_LIQUIDATIONS
} from 'reducers/network/system';

const totalDebt = addresses => ({
  target: addresses.MCD_VAT,
  call: ['debt()(uint256)'],
  returns: [[TOTAL_DEBT, val => DAI.rad(val)]]
});

const baseRate = addresses => ({
  target: addresses.MCD_JUG,
  call: ['base()(uint256)'],
  returns: [[BASE_RATE]]
});

const globalDebtCeiling = addresses => ({
  target: addresses.MCD_VAT,
  call: ['Line()(uint256)'],
  returns: [[GLOBAL_DEBT_CEILING, val => fromRad(val)]]
});

const debtAuctionLotSzie = addresses => ({
  target: addresses.MCD_VOW,
  call: ['sump()(uint256)'],
  returns: [[DEBT_AUCTION_LOT_SIZE, val => DAI.rad(val)]]
});

const surplusAuctionLotSize = addresses => ({
  target: addresses.MCD_VOW,
  call: ['bump()(uint256)'],
  returns: [[SURPLUS_AUCTION_LOT_SIZE, val => DAI.rad(val)]]
});

const numberOfLiquidations = addresses => ({
  target: addresses.MCD_CAT,
  call: ['nflip()(uint256)'],
  returns: [[NUMBER_OF_LIQUIDATIONS]]
});

export function createCDPSystemModel(addresses) {
  return [
    totalDebt,
    baseRate,
    globalDebtCeiling,
    debtAuctionLotSzie,
    surplusAuctionLotSize,
    numberOfLiquidations
  ].map(f => f(addresses));
}
