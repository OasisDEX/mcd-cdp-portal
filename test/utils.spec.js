import {
  activityString,
  fullActivityString,
  firstLetterLowercase,
  formatDate
} from '../src/utils/ui';
import { mockHistoryDataFromSDK } from '../src/reducers/cdps';

test('fullActivityString', () => {
  expect(fullActivityString(mockHistoryDataFromSDK[2])).toBe(
    'Deposited 10,000 ETH and generated 120,000 DAI'
  );
});

test('firstLetterLowercase', () => {
  expect(firstLetterLowercase('Word')).toBe('word');
});

test('formatDate', () => {
  expect(formatDate(new Date(0))).toBe('Jan 1, 1970');
});
