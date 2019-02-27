import { USD } from 'maker';
import { toHex } from 'utils/ethereum';
import { fromWei, fromRay, fromRad, sub, mul, RAY } from 'utils/units';
import {
  ADAPTER_BALANCE,
  MAX_AUCTION_LOT_SIZE,
  LIQUIDATION_PENALTY,
  LIQUIDATOR_ADDRESS,
  LIQUIDATION_RATIO,
  FEED_SET_USD,
  FEED_VALUE_USD,
  RATE,
  LAST_DRIP,
  PRICE_WITH_SAFETY_MARGIN,
  DEBT_CEILING
} from 'reducers/network/cdpTypes';

export const priceFeed = addresses => (name, { decimals = 18 } = {}) => ({
  target: addresses[`PIP_${name}`],
  call: ['peek()(uint256,bool)'],
  returns: [
    [`${name}.${FEED_VALUE_USD}`, val => USD(val, -decimals)],
    [`${name}.${FEED_SET_USD}`, liveness => (liveness ? 'live' : 'ded')]
  ]
});

export const rateData = addresses => name => ({
  target: addresses.MCD_DRIP,
  call: ['ilks(bytes32)(uint256,uint48)', toHex(name)],
  returns: [
    [`${name}.${RATE}`, val => fromRad(val, 5)],
    [`${name}.${LAST_DRIP}`]
  ]
});

export const pitData = addresses => name => ({
  target: addresses.MCD_PIT,
  call: ['ilks(bytes32)(uint256,uint256)', toHex(name)],
  returns: [
    [`${name}.${PRICE_WITH_SAFETY_MARGIN}`, val => fromRay(val, 5)],
    [`${name}.${DEBT_CEILING}`, val => fromWei(val, 5)]
  ]
});

export const liquidation = addresses => name => ({
  target: addresses[`MCD_SPOT_${name}`],
  call: ['mat()(uint256)'],
  returns: [[`${name}.${LIQUIDATION_RATIO}`, val => fromRay(mul(val, 100), 2)]]
});

export const flipper = addresses => name => ({
  target: addresses.MCD_CAT,
  call: ['ilks(bytes32)(address,uint256,uint256)', toHex(name)],
  returns: [
    [`${name}.${LIQUIDATOR_ADDRESS}`],
    [
      `${name}.${LIQUIDATION_PENALTY}`,
      val => fromRay(mul(sub(val, RAY), 100), 2)
    ],
    [`${name}.${MAX_AUCTION_LOT_SIZE}`, val => fromWei(val, 5)]
  ]
});

export const adapterBalance = addresses => name => ({
  target: addresses[name],
  call: ['balanceOf(address)(uint256)', addresses[`MCD_JOIN_${name}`]],
  returns: [[`${name}.${ADAPTER_BALANCE}`, val => fromWei(val, 5)]]
});

export function createCDPTypeModel(cdpKey, addresses) {
  const cdpModel = [
    priceFeed,
    rateData,
    pitData,
    liquidation,
    flipper,
    adapterBalance
  ].map(f => f(addresses)(cdpKey));
  return cdpModel;
}
