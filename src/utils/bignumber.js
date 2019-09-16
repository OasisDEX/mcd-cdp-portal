import BigNumber from 'bignumber.js';

export function greaterThan(numberOne, numberTwo) {
  return (
    BigNumber(numberOne.toString()).comparedTo(
      BigNumber(numberTwo.toString())
    ) === 1
  );
}

export function greaterThanOrEqual(numberOne, numberTwo) {
  return (
    BigNumber(numberOne.toString()).comparedTo(
      BigNumber(numberTwo.toString())
    ) >= 0
  );
}

export function subtract(numberOne, numberTwo) {
  return BigNumber(numberOne.toString())
    .minus(BigNumber(numberTwo.toString()))
    .toFixed()
    .toString();
}

export function multiply(numberOne, numberTwo) {
  return BigNumber(numberOne.toString())
    .times(BigNumber(numberTwo.toString()))
    .toFixed()
    .toString();
}

export function divide(numberOne, numberTwo) {
  return BigNumber(numberOne.toString())
    .dividedBy(BigNumber(numberTwo.toString()))
    .toFixed()
    .toString();
}

export function minimum(numberOne, numberTwo) {
  return BigNumber.min(numberOne.toString(), numberTwo.toString())
    .toFixed()
    .toString();
}

export function maximum(numberOne, numberTwo) {
  return BigNumber.max(numberOne.toString(), numberTwo.toString())
    .toFixed()
    .toString();
}
