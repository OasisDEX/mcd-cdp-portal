import accountsReducer from '../accounts';
import { showWalletTokens } from 'references/config';
import BigNumber from 'bignumber.js';

const mockAddress = '0xDEADBEEF';

test('App is using the correct token set', () => {
  expect(showWalletTokens).toEqual([
    'MDAI',
    'DSR',
    'ETH',
    'SAI',
    'MWETH',
    'BAT'
  ]);
});

test('Instantiates correct default state', () => {
  const action = { type: `accounts.${mockAddress}` };
  const state = accountsReducer({}, action);
  expect(state).toHaveProperty(mockAddress);
  expect(state[mockAddress]).toHaveProperty(
    'balances',
    'allowances',
    'savings'
  );
  expect(state[mockAddress].balances).toEqual({});
  expect(state[mockAddress].allowances).toEqual({});
  expect(state[mockAddress].savings.toString()).toEqual('0');
});

test('Updates token balances in state correctly', () => {
  const mockRawValue = '1';
  const value = new BigNumber(mockRawValue);

  const action1 = {
    type: `accounts.${mockAddress}.balances.DAI`,
    value
  };
  const state1 = accountsReducer({}, action1);
  expect(state1[mockAddress].balances).toHaveProperty('DAI');
  expect(state1[mockAddress].balances.DAI.toString()).toEqual(mockRawValue);

  const action2 = {
    type: `accounts.${mockAddress}.balances.ETH`,
    value
  };
  const state2 = accountsReducer(state1, action2);
  expect(state2[mockAddress].balances).toHaveProperty('DAI');
  expect(state2[mockAddress].balances.DAI.toString()).toEqual(mockRawValue);
  expect(state2[mockAddress].balances).toHaveProperty('ETH');
  expect(state2[mockAddress].balances.ETH.toString()).toEqual(mockRawValue);
});

test('Updates token allowances in state correctly', () => {
  const mockRawValue = '1';
  const value = new BigNumber(mockRawValue);

  const action1 = {
    type: `accounts.${mockAddress}.allowances.DAI`,
    value
  };
  const state1 = accountsReducer({}, action1);
  expect(state1[mockAddress].allowances).toHaveProperty('DAI');
  expect(state1[mockAddress].allowances.DAI.toString()).toEqual(mockRawValue);

  const action2 = {
    type: `accounts.${mockAddress}.allowances.ETH`,
    value
  };
  const state2 = accountsReducer(state1, action2);
  expect(state2[mockAddress].allowances).toHaveProperty('DAI');
  expect(state2[mockAddress].allowances.DAI.toString()).toEqual(mockRawValue);
  expect(state2[mockAddress].allowances).toHaveProperty('ETH');
  expect(state2[mockAddress].allowances.ETH.toString()).toEqual(mockRawValue);
});

test('Updates account savings in state correctly', () => {
  const mockRawValue = '1';
  const value = new BigNumber(mockRawValue);

  const action = {
    type: `accounts.${mockAddress}.savings`,
    value
  };
  const state = accountsReducer({}, action);
  expect(state[mockAddress].savings.toString()).toEqual(mockRawValue);
});
