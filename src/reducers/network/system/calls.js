import { DAI, USD } from 'maker';
import { fromRad } from 'utils/units';
import {
  TOTAL_DEBT,
  BASE_RATE,
  GLOBAL_DEBT_CEILING,
  DEBT_AUCTION_LOT_SIZE,
  SURPLUS_AUCTION_LOT_SIZE,
  NUMBER_OF_LIQUIDATIONS,
  FEED_VALUE_USD,
  FEED_SET_USD
} from 'reducers/network/system';
import { shownFeedGems } from 'references/gems';

export const priceFeeds = addresses =>
  shownFeedGems().map(({ key: gem, decimals = 18 }) => ({
    target: addresses[`PIP_${gem}`],
    call: ['peek()(uint256,bool)'],
    returns: [
      [`${gem}.${FEED_VALUE_USD}`, val => USD(val, -decimals)],
      [`${gem}.${FEED_SET_USD}`, liveness => (liveness ? 'live' : 'ded')]
    ]
  }));

const totalDebt = addresses => ({
  target: addresses.MCD_VAT,
  call: ['debt()(uint256)'],
  returns: [[TOTAL_DEBT, val => DAI(val, -45)]]
});

const baseRate = addresses => ({
  target: addresses.MCD_JUG,
  call: ['repo()(uint256)'],
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
  returns: [[DEBT_AUCTION_LOT_SIZE, val => DAI(val, -18)]]
});

const surplusAuctionLotSize = addresses => ({
  target: addresses.MCD_VOW,
  call: ['bump()(uint256)'],
  returns: [[SURPLUS_AUCTION_LOT_SIZE, val => DAI(val, -18)]]
});

const numberOfLiquidations = addresses => ({
  target: addresses.MCD_CAT,
  call: ['nflip()(uint256)'],
  returns: [[NUMBER_OF_LIQUIDATIONS]]
});

export function createSystemWatcherCalls(addresses) {
  const calls = [
    totalDebt,
    baseRate,
    globalDebtCeiling,
    debtAuctionLotSzie,
    surplusAuctionLotSize,
    numberOfLiquidations
  ].map(f => f(addresses));
  calls.push(...priceFeeds(addresses));
  return calls;
}
