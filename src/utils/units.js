import BigNumber from 'bignumber.js';

export const MAX_UINT_HEX = `0x${Array(64 + 1).join('f')}`;
export const MAX_UINT_BN = BigNumber(MAX_UINT_HEX).shiftedBy(-18);
export const RAD = BigNumber('1000000000000000000000000000000000000000000000');
export const RAY = BigNumber('1000000000000000000000000000');
export const WAD = BigNumber('1000000000000000000');

export function fromWei(value) {
  return BigNumber(value).shiftedBy(-18);
}

export function fromRay(value) {
  return BigNumber(value).shiftedBy(-27);
}

export function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}

export function fromDecimals(value, decimals = 18) {
  return BigNumber(value).shiftedBy(-decimals);
}
