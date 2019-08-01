import { toHex } from 'utils/ethereum';
import {
  ADAPTER_BALANCE,
  MAX_AUCTION_LOT_SIZE,
  LIQUIDATION_PENALTY,
  LIQUIDATOR_ADDRESS,
  LIQUIDATION_RATIO,
  DUTY,
  RATE,
  LAST_DRIP,
  PRICE_WITH_SAFETY_MARGIN,
  DEBT_CEILING,
  ILK_ART
} from 'reducers/feeds';

export default function(addresses, { key: name, gem }) {
  return [
    {
      target: addresses.MCD_JUG,
      call: ['ilks(bytes32)(uint256,uint48)', toHex(name)],
      returns: [[`ilk.${name}.${DUTY}`], [`ilk.${name}.${LAST_DRIP}`]]
    },
    {
      target: addresses.MCD_VAT,
      call: [
        'ilks(bytes32)(uint256,uint256,uint256,uint256,uint256)',
        toHex(name)
      ],
      returns: [
        [`ilk.${name}.${ILK_ART}`],
        [`ilk.${name}.${RATE}`],
        [`ilk.${name}.${PRICE_WITH_SAFETY_MARGIN}`],
        [`ilk.${name}.${DEBT_CEILING}`],
        []
      ]
    },
    {
      target: addresses.MCD_SPOT,
      call: ['ilks(bytes32)(address,uint256)', toHex(name)],
      returns: [[`ilk.${name}.pip`], [`ilk.${name}.${LIQUIDATION_RATIO}`]]
    },
    {
      target: addresses.MCD_CAT,
      call: ['ilks(bytes32)(address,uint256,uint256)', toHex(name)],
      returns: [
        [`ilk.${name}.${LIQUIDATOR_ADDRESS}`],
        [`ilk.${name}.${LIQUIDATION_PENALTY}`],
        [`ilk.${name}.${MAX_AUCTION_LOT_SIZE}`]
      ]
    },
    {
      target: addresses[gem],
      call: [
        'balanceOf(address)(uint256)',
        addresses[`MCD_JOIN_${name.replace('-', '_')}`]
      ],
      returns: [[`ilk.${name}.${ADAPTER_BALANCE}`]]
    }
  ];
}
