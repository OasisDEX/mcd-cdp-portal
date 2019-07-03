import React from 'react';
import Presentation from '../Presentation';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import { createCurrency } from '@makerdao/currency';

const LOL = createCurrency('LOL');

afterEach(cleanup);

const cdp = {
  id: 1,
  ilk: 'LOL-A',
  ink: '10',
  art: '80',
  rate: '1.5',
  liquidationRatio: 150,
  price: LOL(200),
  currency: {
    symbol: 'LOL'
  }
};

const account = {
  cdps: [{ id: 1 }]
};

test('basic rendering', () => {
  const showSidebar = jest.fn(() => {});
  const { getByText } = render(
    <Presentation cdp={cdp} account={account} showSidebar={showSidebar} />
  );
  getByText('9.1 LOL');
  getByText('1820 USD');
  getByText('120 DAI');
  getByText('1213.33 DAI');

  fireEvent.click(getByText('Deposit'));
  expect(showSidebar).toBeCalledWith({ type: 'deposit', props: { cdpId: 1 } });
});
