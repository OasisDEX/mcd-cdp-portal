import { fromWei, fromRad } from 'utils/units';
import {
  TOTAL_DEBT,
  BAD_DEBT,
  BASE_RATE,
  GLOBAL_DEBT_CEILING,
  TOTAL_QUEUED_SIN,
  TOTAL_SIN_IN_DEBT_AUCTIONS,
  DEBT_AUCTION_LOT_SIZE,
  SURPLUS_AUCTION_LOT_SIZE,
  NUMBER_OF_LIQUIDATIONS
} from 'reducers/network/system';
import contractAddresses from 'references/addresses.json';
const kovanAddresses = contractAddresses.kovan;

const totalDebt = {
  target: kovanAddresses.vat,
  call: ['debt()(uint256)'],
  returns: [[TOTAL_DEBT, val => fromRad(val, 5)]]
};

const badDebt = {
  target: kovanAddresses.vat,
  call: ['vice()(uint256)'],
  returns: [[BAD_DEBT, val => fromRad(val, 5)]]
};

const baseRate = {
  target: kovanAddresses.drip,
  call: ['repo()(uint256)'],
  returns: [[BASE_RATE]]
};

const globalDebtCeiling = {
  target: kovanAddresses.pit,
  call: ['Line()(uint256)'],
  returns: [[GLOBAL_DEBT_CEILING, val => fromWei(val, 5)]]
};

const totalQueuedSin = {
  target: kovanAddresses.vow,
  call: ['Sin()(uint256)'],
  returns: [[TOTAL_QUEUED_SIN, val => fromWei(val, 5)]]
};

const totalSinInDebtAuctions = {
  target: kovanAddresses.vow,
  call: ['Ash()(uint256)'],
  returns: [[TOTAL_SIN_IN_DEBT_AUCTIONS, val => fromWei(val, 5)]]
};

const debtAuctionLotSzie = {
  target: kovanAddresses.vow,
  call: ['sump()(uint256)'],
  returns: [[DEBT_AUCTION_LOT_SIZE, val => fromWei(val, 5)]]
};

const surplusAuctionLotSize = {
  target: kovanAddresses.vow,
  call: ['bump()(uint256)'],
  returns: [[SURPLUS_AUCTION_LOT_SIZE, val => fromWei(val, 5)]]
};

const numberOfLiquidations = {
  target: kovanAddresses.cat,
  call: ['nflip()(uint256)'],
  returns: [[NUMBER_OF_LIQUIDATIONS]]
};

export const cdpSystemStateModel = [
  totalDebt,
  badDebt,
  baseRate,
  globalDebtCeiling,
  totalQueuedSin,
  totalSinInDebtAuctions,
  debtAuctionLotSzie,
  surplusAuctionLotSize,
  numberOfLiquidations
];
