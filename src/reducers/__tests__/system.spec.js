import systemReducer, {
  initialState,
  TOTAL_DEBT,
  BASE_RATE,
  GLOBAL_DEBT_CEILING,
  DEBT_AUCTION_LOT_SIZE,
  SURPLUS_AUCTION_LOT_SIZE,
  NUMBER_OF_LIQUIDATIONS,
  PAR,
  TOTAL_SAVINGS_DAI,
  TOTAL_CDPS
} from '../system';
import BigNumber from 'bignumber.js';

const initialise = () => systemReducer(initialState, { type: 'savings' });

test('Instantiates passed initial state correctly', () => {
  const state = initialise();

  expect(state).toHaveProperty(
    TOTAL_DEBT,
    BASE_RATE,
    GLOBAL_DEBT_CEILING,
    DEBT_AUCTION_LOT_SIZE,
    SURPLUS_AUCTION_LOT_SIZE,
    NUMBER_OF_LIQUIDATIONS,
    PAR,
    TOTAL_SAVINGS_DAI,
    TOTAL_CDPS
  );

  expect(state[TOTAL_DEBT]).toEqual('0');
  expect(state[BASE_RATE]).toEqual('0');
  expect(state[GLOBAL_DEBT_CEILING]).toEqual('0');
  expect(state[DEBT_AUCTION_LOT_SIZE]).toEqual('0');
  expect(state[SURPLUS_AUCTION_LOT_SIZE]).toEqual('0');
  expect(state[NUMBER_OF_LIQUIDATIONS]).toEqual('0');
  expect(state[PAR]).toEqual('0');
  expect(state[TOTAL_SAVINGS_DAI]).toEqual('0');
  expect(state[TOTAL_CDPS]).toEqual('0');
});

test('Correct precision for global debt ceiling value', () => {
  const x = initialise();
  const action = {
    type: `system.${GLOBAL_DEBT_CEILING}`,
    value: BigNumber('1')
  };
  const state = systemReducer(x, action);
  expect(state[GLOBAL_DEBT_CEILING]).toEqual(BigNumber(1).shiftedBy(-45));
});

test('Correct precision in dai for total debt value', () => {
  const x = initialise();
  const action = {
    type: `system.${TOTAL_DEBT}`,
    value: BigNumber('1').shiftedBy(45)
  };
  const state = systemReducer(x, action);
  expect(state[TOTAL_DEBT].toString()).toEqual('1.00 DAI');
});

test('Correct precision in dai for debt auction size', () => {
  const x = initialise();
  const action = {
    type: `system.${DEBT_AUCTION_LOT_SIZE}`,
    value: BigNumber('1').shiftedBy(45)
  };
  const state = systemReducer(x, action);
  expect(state[DEBT_AUCTION_LOT_SIZE].toString()).toEqual('1.00 DAI');
});

test('Correct precision in dai for surplus auction size', () => {
  const x = initialise();
  const action = {
    type: `system.${SURPLUS_AUCTION_LOT_SIZE}`,
    value: BigNumber('1').shiftedBy(45)
  };
  const state = systemReducer(x, action);
  expect(state[SURPLUS_AUCTION_LOT_SIZE].toString()).toEqual('1.00 DAI');
});

test('Correct precision in dai for surplus auction size', () => {
  const x = initialise();
  const action = {
    type: `system.${SURPLUS_AUCTION_LOT_SIZE}`,
    value: BigNumber('1').shiftedBy(45)
  };
  const state = systemReducer(x, action);
  expect(state[SURPLUS_AUCTION_LOT_SIZE].toString()).toEqual('1.00 DAI');
});

test('Correct precision in dai for total savings dai', () => {
  const x = initialise();
  const action = {
    type: `system.${TOTAL_SAVINGS_DAI}`,
    value: BigNumber('1').shiftedBy(18)
  };
  const state = systemReducer(x, action);
  expect(state[TOTAL_SAVINGS_DAI].toString()).toEqual('1.00 DAI');
});
