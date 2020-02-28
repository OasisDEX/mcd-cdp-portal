/* eslint-disable */
import { toHex } from 'utils/ethereum';
export const priceFeedAddress = 'priceFeedAddress';
export const liquidationRatio = 'liquidationRatio';
export const refPerDai = 'refPerDai';

export const spotIlks = {
  generate: ilkName => ({
    id: `MCD_SPOT.ilks(${ilkName})`,
    contractName: 'MCD_SPOT',
    call: [
      'ilks(bytes32)(address,uint256)',
      toHex(ilkName)
    ],
  }),
  returns: [
    priceFeedAddress,
    liquidationRatio
  ]
};

export const spotPar = {
  generate: () => ({
    id: 'MCD_SPOT.par()',
    contractName: 'MCD_SPOT',
    call: ['par()(uint256)'],
  }),
  returns: [
    refPerDai
  ]
};

export default {
  spotIlks,
  spotPar
};
