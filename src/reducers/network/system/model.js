import { DAI } from 'maker';
import {
  TOTAL_DEBT,
  BASE_RATE,
  GLOBAL_DEBT_CEILING,
  DEBT_AUCTION_LOT_SIZE,
  SURPLUS_AUCTION_LOT_SIZE,
  NUMBER_OF_LIQUIDATIONS
} from 'reducers/network/system';
import contractAddresses from 'references/addresses.json';
const kovanAddresses = contractAddresses.kovan;

const totalDebt = {
  target: kovanAddresses.vat,
  call: ['debt()(uint256)'],
  returns: [[TOTAL_DEBT, val => DAI(val, -45)]]
};

const baseRate = {
  target: kovanAddresses.drip,
  call: ['repo()(uint256)'],
  returns: [[BASE_RATE]]
};

const globalDebtCeiling = {
  target: kovanAddresses.pit,
  call: ['Line()(uint256)'],
  returns: [[GLOBAL_DEBT_CEILING, val => DAI(val, -18)]]
};

const debtAuctionLotSzie = {
  target: kovanAddresses.vow,
  call: ['sump()(uint256)'],
  returns: [[DEBT_AUCTION_LOT_SIZE, val => DAI(val, -18)]]
};

const surplusAuctionLotSize = {
  target: kovanAddresses.vow,
  call: ['bump()(uint256)'],
  returns: [[SURPLUS_AUCTION_LOT_SIZE, val => DAI(val, -18)]]
};

const numberOfLiquidations = {
  target: kovanAddresses.cat,
  call: ['nflip()(uint256)'],
  returns: [[NUMBER_OF_LIQUIDATIONS]]
};

export const cdpSystemStateModel = [
  totalDebt,
  baseRate,
  globalDebtCeiling,
  debtAuctionLotSzie,
  surplusAuctionLotSize,
  numberOfLiquidations
];
