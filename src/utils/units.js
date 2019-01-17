import BigNumber from 'bignumber.js';

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
