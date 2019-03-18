import BigNumber from 'bignumber.js';

export const MAX_UINT_HEX = `0x${Array(64 + 1).join('f')}`;
export const MAX_UINT_BN = BigNumber(MAX_UINT_HEX).shiftedBy(-18);
export const RAD = BigNumber('1000000000000000000000000000000000000000000000');
export const RAY = BigNumber('1000000000000000000000000000');
export const WAD = BigNumber('1000000000000000000');

export function fromWei(value, digits) {
  return BigNumber(value)
    .shiftedBy(-18)
    .toFixed(digits);
}

export function fromRay(value, digits) {
  return BigNumber(value)
    .shiftedBy(-27)
    .toFixed(digits);
}

export function fromRad(value, digits) {
  return BigNumber(value)
    .shiftedBy(-45)
    .toFixed(digits);
}

export function sub(a, b) {
  return BigNumber(a)
    .minus(BigNumber(b))
    .toFixed();
}

export function mul(a, b) {
  return BigNumber(a)
    .times(BigNumber(b))
    .toFixed();
}
