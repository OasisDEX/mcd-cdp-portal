/* eslint-disable */
import { DAI } from '../../maker';
import { toHex } from 'utils/ethereum';
import { fromRay, fromRad } from 'utils/units';

export const totalEncumberedDebt = 'totalEncumberedDebt';
export const debtScalingFactor = 'debtScalingFactor';
export const priceWithSafetyMargin = 'priceWithSafetyMargin';
export const debtCeiling = 'debtCeiling';
export const urnDebtFloor = 'urnDebtFloor';

export const totalDaiSupply = {
  generate: () => ({
    id: `VAT.debt()`,
    contractName: 'MCD_VAT',
    call: ['debt()(uint256)']
  }),
  returns: [
    ['totalDaiSupply', DAI.rad]
  ]
};

export const ilk = {
  generate: ilkName => ({
    id: `MCD_VAT.ilks(${ilkName})`,
    contractName: 'MCD_VAT',
    call: [
      'ilks(bytes32)(uint256,uint256,uint256,uint256,uint256)',
      toHex(ilkName)
    ]
  }),
  returns: [
    totalEncumberedDebt,
    [debtScalingFactor, fromRay],
    priceWithSafetyMargin,
    [debtCeiling, fromRad],
    urnDebtFloor
  ]
};

export default {
  ilk,
  totalDaiSupply
};
