import feedsReducer, { initialState } from '../feeds';
import { RAY } from 'utils/units';
import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';

// Testing values as they come directly from multicall

test('duty is calculated correctly', () => {
  const mockRawValue = '3.123';
  const decimalsValue = new Decimal(mockRawValue)
    .dividedBy(100)
    .plus(1)
    .pow(1 / (60 * 60 * 24 * 365));
  const value = new BigNumber(decimalsValue.toString()).times(RAY);
  const action = {
    type: 'ilk.ETH-A.duty',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].duty).toEqual(mockRawValue);
});

test('rate is calculated correctly', () => {
  const mockRawValue = '1';
  const value = new BigNumber(mockRawValue).shiftedBy(27);
  const action = {
    type: 'ilk.ETH-A.rate',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].rate).toEqual(new BigNumber(mockRawValue).toFixed(18));
});

test('debtCeiling is calculated correctly', () => {
  const mockRawValue = '50000000';
  const value = new BigNumber(mockRawValue).shiftedBy(45);
  const action = {
    type: 'ilk.ETH-A.debtCeiling',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].debtCeiling).toEqual(mockRawValue);
});

test('dust is calculated correctly', () => {
  const mockRawValue = '20';
  const value = new BigNumber(mockRawValue).shiftedBy(45);
  const action = {
    type: 'ilk.ETH-A.dust',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].dust).toEqual(mockRawValue);
});

test('maxAuctionLotSize is calculated correctly', () => {
  const mockRawValue = '50.00000';
  const value = new BigNumber(mockRawValue).shiftedBy(18);
  const action = {
    type: 'ilk.ETH-A.maxAuctionLotSize',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].maxAuctionLotSize).toEqual(mockRawValue);
});

test('maxAuctionLotSize is calculated correctly', () => {
  const mockRawValue = '50.00000';
  const value = new BigNumber(mockRawValue).shiftedBy(18);
  const action = {
    type: 'ilk.ETH-A.maxAuctionLotSize',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].maxAuctionLotSize).toEqual(mockRawValue);
});

test('adapterBalance is calculated correctly', () => {
  const mockRawValue = '2.00000';
  const value = new BigNumber(mockRawValue).shiftedBy(18);
  const action = {
    type: 'ilk.ETH-A.adapterBalance',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].adapterBalance).toEqual(mockRawValue);
});

test('liquidationRatio is calculated correctly', () => {
  const mockRawValue = '150';
  const value = new BigNumber(mockRawValue).dividedBy(100).shiftedBy(27);
  const action = {
    type: 'ilk.ETH-A.liquidationRatio',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].liquidationRatio).toEqual(mockRawValue);
});

test('liquidationPenalty is calculated correctly', () => {
  const mockRawValue = '13.00';
  const value = new BigNumber(mockRawValue)
    .dividedBy(100)
    .shiftedBy(27)
    .plus(RAY);
  const action = {
    type: 'ilk.ETH-A.liquidationPenalty',
    value
  };
  const newState = feedsReducer(initialState, action);
  expect(newState[0].liquidationPenalty).toEqual(mockRawValue);
});
