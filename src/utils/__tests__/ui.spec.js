import { fullActivityString, firstLetterLowercase, formatDate } from '../ui';
import { mockHistoryDataFromSDK } from '../../reducers/cdps';

test('fullActivityString', () => {
  expect(fullActivityString(mockHistoryDataFromSDK[4])).toBe(
    'Deposited 10,000 ETH and generated 120,000 DAI'
  );
});

test('firstLetterLowercase', () => {
  expect(firstLetterLowercase('Word')).toBe('word');
});

test('formatDate', () => {
  const date = new Date(0);
  expect(formatDate(date)).toBe(
    date.getTimezoneOffset() > 0 ? 'Dec 31, 1969' : 'Jan 1, 1970'
  );
});
