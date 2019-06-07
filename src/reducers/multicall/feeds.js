import {
  liquidationPenalty,
  liquidationRatio
} from '@makerdao/dai-plugin-mcd/dist/math';
import { toHex } from 'utils/ethereum';
import { fromWei } from 'utils/units';

export const FEED_SET_USD = 'feedSetUSD';
export const FEED_VALUE_USD = 'price';
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

export const rateData = addresses => name => ({
  target: addresses.MCD_JUG,
  call: ['ilks(bytes32)(uint256,uint48)', toHex(name)],
  returns: [[`ilk.${name}.${DUTY}`], [`ilk.${name}.${LAST_DRIP}`]]
});

export const ilkVatData = addresses => name => ({
  target: addresses.MCD_VAT,
  call: ['ilks(bytes32)(uint256,uint256,uint256,uint256,uint256)', toHex(name)],
  returns: [
    [],
    [`ilk.${name}.${RATE}`],
    [`ilk.${name}.${SPOT}`],
    [`ilk.${name}.${DEBT_CEILING}`],
    []
  ]
});

export const liquidation = addresses => name => ({
  target: addresses.MCD_SPOT,
  call: ['ilks(bytes32)(address,uint256)', toHex(name)],
  returns: [
    [`ilk.${name}.pip`],
    [`ilk.${name}.${LIQUIDATION_RATIO}`, mat => liquidationRatio(mat)]
  ]
});

export const flipper = addresses => name => ({
  target: addresses.MCD_CAT,
  call: ['ilks(bytes32)(address,uint256,uint256)', toHex(name)],
  returns: [
    [`ilk.${name}.${LIQUIDATOR_ADDRESS}`],
    [`ilk.${name}.${LIQUIDATION_PENALTY}`, chop => liquidationPenalty(chop)],
    [`ilk.${name}.${MAX_AUCTION_LOT_SIZE}`, val => fromWei(val, 5)]
  ]
});

export const adapterBalance = addresses => name => ({
  target: addresses[name],
  call: ['balanceOf(address)(uint256)', addresses[`MCD_JOIN_${name}`]],
  returns: [[`ilk.${name}.${ADAPTER_BALANCE}`, val => fromWei(val, 5)]]
});

export function createCDPTypeModel(ilk, addresses) {
  const cdpModel = [
    rateData,
    liquidation,
    flipper,
    ilkVatData,
    adapterBalance
  ].map(f => f(addresses)(ilk));
  return cdpModel;
}
