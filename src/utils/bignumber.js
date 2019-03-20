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

export function multiply(numberOne, numberTwo) {
  return BigNumber(numberOne.toString())
    .times(BigNumber(numberTwo.toString()))
    .toString();
}

export function divide(numberOne, numberTwo) {
  return BigNumber(numberOne.toString())
    .dividedBy(BigNumber(numberTwo.toString()))
    .toString();
}
