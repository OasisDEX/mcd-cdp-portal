import cdpsReducer, { initialState } from '../cdps';
import BigNumber from 'bignumber.js';

const cdpId = '1';

test('initialising cdp data by id', () => {
  const mockValueTypeValue = 1;
  const action = {
    type: `cdp.${cdpId}.mockValueType`,
    value: mockValueTypeValue
  };
  const newState = cdpsReducer(initialState, action);
  expect(newState).toHaveProperty(cdpId);
  expect(newState[cdpId]).toHaveProperty(
    'inited',
    'ink',
    'art',
    'unlockedCollateral',
    'ilk',
    'mockValueType'
  );
  expect(newState[cdpId].inited).toBe(true);
  expect(newState[cdpId].mockValueType).toEqual(1);
});

test('ink is calculated correctly', () => {
  const mockRawValue = '123';
  const value = new BigNumber(mockRawValue).shiftedBy(18);
  const action = {
    type: `cdp.${cdpId}.ink`,
    value
  };
  const newState = cdpsReducer(initialState, action);
  expect(newState[cdpId].ink.toString()).toEqual(mockRawValue);
});

test('art is calculated correctly', () => {
  const mockRawValue = '123';
  const value = new BigNumber(mockRawValue).shiftedBy(18);
  const action = {
    type: `cdp.${cdpId}.art`,
    value
  };
  const newState = cdpsReducer(initialState, action);
  expect(newState[cdpId].art.toString()).toEqual(mockRawValue);
});

test('unlockedCollateral is calculated correctly', () => {
  const mockRawValue = '123';
  const value = new BigNumber(mockRawValue).shiftedBy(18);
  const action = {
    type: `cdp.${cdpId}.unlockedCollateral`,
    value
  };
  const newState = cdpsReducer(initialState, action);
  expect(newState[cdpId].unlockedCollateral.toString()).toEqual(mockRawValue);
});
