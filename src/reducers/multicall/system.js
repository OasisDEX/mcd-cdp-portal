import {
  TOTAL_DEBT,
  BASE_RATE,
  GLOBAL_DEBT_CEILING,
  DEBT_AUCTION_LOT_SIZE,
  SURPLUS_AUCTION_LOT_SIZE,
  PAR
} from 'reducers/system';

export function createCDPSystemModel(addresses) {
  return [].map(f => f(addresses));
}
