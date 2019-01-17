import { toHex } from 'utils/ethereum';
import { fromWei, fromRay, fromRad } from 'utils/units';
import {
  ADAPTER_BALANCE,
  MAX_AUCTION_LOT_SIZE,
  LIQUIDATION_PENALTY,
  LIQUIDATOR_ADDRESS,
  LIQUIDATION_RATIO,
  FEED_LIVENESS,
  FEED_VALUE,
  RATE,
  LAST_DRIP,
  PRICE_WITH_SAFETY_MARGIN,
  DEBT_CEILING
} from 'reducers/network/cdpTypes';
import contractAddresses from 'references/addresses.json';
const kovanAddresses = contractAddresses.kovan;

const priceFeed = name => ({
  target: kovanAddresses[name].pip,
  call: ['peek()(uint256,bool)'],
  returns: [
    [`${name}.${FEED_VALUE}`, val => fromWei(val, 5)],
    [`${name}.${FEED_LIVENESS}`, liveness => (liveness ? 'live' : 'ded')]
  ]
});

const rateData = name => ({
  target: kovanAddresses.drip,
  call: ['ilks(bytes32)(uint256,uint48)', toHex(name)],
  returns: [
    [`${name}.${RATE}`, val => fromRad(val, 5)],
    [`${name}.${LAST_DRIP}`]
  ]
});

const pitData = name => ({
  target: kovanAddresses.pit,
  call: ['ilks(bytes32)(uint256,uint256)', toHex(name)],
  returns: [
    [`${name}.${PRICE_WITH_SAFETY_MARGIN}`, val => fromRay(val, 5)],
    [`${name}.${DEBT_CEILING}`, val => fromWei(val, 5)]
  ]
});

const liquidation = name => ({
  target: kovanAddresses[name].spot,
  call: ['mat()(uint256)'],
  returns: [[`${name}.${LIQUIDATION_RATIO}`, val => fromWei(val, 5)]]
});

const flipper = name => ({
  target: kovanAddresses.cat,
  call: ['ilks(bytes32)(address,uint256,uint256)', toHex(name)],
  returns: [
    [`${name}.${LIQUIDATOR_ADDRESS}`],
    [`${name}.${LIQUIDATION_PENALTY}`, val => fromRay(val, 5)],
    [`${name}.${MAX_AUCTION_LOT_SIZE}`, val => fromWei(val, 5)]
  ]
});

const adapterBalance = name => ({
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
