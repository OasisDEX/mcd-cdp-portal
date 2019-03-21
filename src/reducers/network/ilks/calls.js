import BigNumber from 'bignumber.js';

import { toHex } from 'utils/ethereum';
import { fromWei, fromRay, sub, mul, RAY } from 'utils/units';
import {
  ADAPTER_BALANCE,
  MAX_AUCTION_LOT_SIZE,
  LIQUIDATION_PENALTY,
  LIQUIDATOR_ADDRESS,
  LIQUIDATION_RATIO,
  RATE,
  LAST_DRIP,
  PRICE_WITH_SAFETY_MARGIN,
  DEBT_CEILING
} from 'reducers/network/ilks';

export const rateData = addresses => ilk => ({
  target: addresses.MCD_JUG,
  call: ['ilks(bytes32)(uint256,uint48)', toHex(ilk)],
  returns: [
    [
      `${ilk}.${RATE}`,
      val => {
        const taxBigNumber = new BigNumber(val.toString()).dividedBy(RAY);
        const secondsPerYear = 60 * 60 * 24 * 365;
        BigNumber.config({ POW_PRECISION: 100 });
        return taxBigNumber
          .pow(secondsPerYear)
          .minus(1)
          .toNumber();
      }
    ],
    [`${ilk}.${LAST_DRIP}`]
  ]
});

export const pitData = addresses => ilk => ({
  target: addresses.MCD_PIT,
  call: ['ilks(bytes32)(uint256,uint256)', toHex(ilk)],
  returns: [
    [`${ilk}.${PRICE_WITH_SAFETY_MARGIN}`, val => fromRay(val, 5)],
    [`${ilk}.${DEBT_CEILING}`, val => fromWei(val, 5)]
  ]
});

export const liquidation = addresses => ilk => ({
  target: addresses[`MCD_SPOT`],
  call: ['ilks(bytes32)(address,uint256)', toHex(ilk)],
  returns: [
    [`pip.${ilk}`],
    [`${ilk}.${LIQUIDATION_RATIO}`, val => fromRay(mul(val, 100), 0)]
  ]
});

export const flipper = addresses => ilk => ({
  target: addresses.MCD_CAT,
  call: ['ilks(bytes32)(address,uint256,uint256)', toHex(ilk)],
  returns: [
    [`${ilk}.${LIQUIDATOR_ADDRESS}`],
    [
      `${ilk}.${LIQUIDATION_PENALTY}`,
      val => fromRay(mul(sub(val, RAY), 100), 2)
    ],
    [`${ilk}.${MAX_AUCTION_LOT_SIZE}`, val => fromWei(val, 5)]
  ]
});

export const adapterBalance = addresses => ilk => ({
  target: addresses[ilk],
  call: ['balanceOf(address)(uint256)', addresses[`MCD_JOIN_${ilk}`]],
  returns: [[`${ilk}.${ADAPTER_BALANCE}`, val => fromWei(val, 5)]]
});

export function createIlkWatcherCalls(addresses, ilk) {
  return [
    rateData,
    liquidation,
    flipper
    // pitData,
    // adapterBalance
  ].map(f => f(addresses)(ilk));
}
