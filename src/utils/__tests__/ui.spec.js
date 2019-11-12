import ReactDOMServer from 'react-dom/server';
import { formatEventDescription, firstLetterLowercase } from '../ui';
import { mockEventDataFromSDK } from '../../reducers/cdps';
import lang from '../../languages';

test('formatEventDescription', () => {
  expect(
    ReactDOMServer.renderToStaticMarkup(
      formatEventDescription(lang, mockEventDataFromSDK[8])
    )
  ).toBe('Deposited <b>10,000</b> ETH into Vault');
});

test('firstLetterLowercase', () => {
  expect(firstLetterLowercase('Word')).toBe('word');
});
