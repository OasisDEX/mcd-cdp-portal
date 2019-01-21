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
import contractAddresses from 'references/addresses.json';
const kovanAddresses = contractAddresses.kovan;

export const priceFeed = (name, { decimals = 18 } = {}) => ({
  target: kovanAddresses[name].pip,
  call: ['peek()(uint256,bool)'],
  returns: [
    [`${name}.${FEED_VALUE_USD}`, val => USD(val, -decimals)],
    [`${name}.${FEED_SET_USD}`, liveness => (liveness ? 'live' : 'ded')]
  ]
});

export const rateData = name => ({
  target: kovanAddresses.drip,
  call: ['ilks(bytes32)(uint256,uint48)', toHex(name)],
  returns: [
    [`${name}.${RATE}`, val => fromRad(val, 5)],
    [`${name}.${LAST_DRIP}`]
  ]
});

export const pitData = name => ({
  target: kovanAddresses.pit,
  call: ['ilks(bytes32)(uint256,uint256)', toHex(name)],
  returns: [
    [`${name}.${PRICE_WITH_SAFETY_MARGIN}`, val => fromRay(val, 5)],
    [`${name}.${DEBT_CEILING}`, val => fromWei(val, 5)]
  ]
});

export const liquidation = name => ({
  target: kovanAddresses[name].spot,
  call: ['mat()(uint256)'],
  returns: [[`${name}.${LIQUIDATION_RATIO}`, val => fromRay(mul(val, 100), 2)]]
});

export const flipper = name => ({
  target: kovanAddresses.cat,
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

export const adapterBalance = name => ({
  target: kovanAddresses[name].tokenContract,
  call: ['balanceOf(address)(uint256)', kovanAddresses[name].join],
  returns: [[`${name}.${ADAPTER_BALANCE}`, val => fromWei(val, 5)]]
});

export function createCDPTypeModel(cdpKey) {
  const cdpModel = [
    priceFeed,
    rateData,
    pitData,
    liquidation,
    flipper,
    adapterBalance
  ].map(f => f(cdpKey));
  return cdpModel;
}
