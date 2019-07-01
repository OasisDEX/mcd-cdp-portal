import mathReducer from '../math';
import { MDAI } from '@makerdao/dai-plugin-mcd';

test('ilk debtAvailable is calculated correctly', () => {
  const initialState = {
    feeds: [
      {
        key: 'ETH-A'
      }
    ]
  };
  // ilk actions for debtAvailable
  const action = {
    type: 'watcherUpdates',
    payload: [
      {
        type: 'ilk.ETH-A.ilkArt',
        value: '389460000000000000000'
      },
      {
        type: 'ilk.ETH-A.rate',
        value: '1000000000000000000000000000'
      },
      {
        type: 'ilk.ETH-A.debtCeiling',
        value: '300000000000000000000000000000000000000000000000000'
      }
    ]
  };
  const newState = mathReducer(initialState, action);
  // line - (art * rate)
  expect(newState.feeds[0].ilkDebtAvailable).toEqual(MDAI(299610.542));
});
