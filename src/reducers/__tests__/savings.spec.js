import savingsReducer, { initialState } from '../savings';

test('Instantiates passed initial state', () => {
  const action = { type: 'savings' };
  const state = savingsReducer(initialState, action);

  expect(state).toHaveProperty('Pie', 'yearlyRate', 'totalDai', 'dsr', 'rho');
  expect(state.Pie.toString()).toEqual('0');
  expect(state.yearlyRate.toString()).toEqual('0');
  expect(state.totalDai.toString()).toEqual('0');
  expect(state.dsr.toString()).toEqual('0');
  expect(state.rho).toEqual(0);
});

test('Can overwrite state', () => {
  const action = { type: 'savings.dsr', value: '1234' };
  const state = savingsReducer(initialState, action);

  expect(state).toHaveProperty('Pie', 'yearlyRate', 'totalDai', 'dsr', 'rho');
  expect(state.Pie.toString()).toEqual('0');
  expect(state.yearlyRate.toString()).toEqual('0');
  expect(state.totalDai.toString()).toEqual('0');
  expect(state.dsr).toEqual('1234');
  expect(state.rho).toEqual(0);
});
