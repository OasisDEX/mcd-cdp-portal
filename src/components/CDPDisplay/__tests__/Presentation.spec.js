import React, { Fragment } from 'react';
import Presentation from '../Presentation';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import {
  renderForSidebar,
  renderWithStore
} from '../../../../test/helpers/render';
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
  const { getByText } = renderWithStore(
    <Presentation cdp={cdp} account={account} showSidebar={showSidebar} />
  );
  getByText('9.1 LOL');
  getByText('1820 USD');
  getByText('120 DAI');
  getByText('1213.33 DAI');

  fireEvent.click(getByText('Deposit'));
  expect(showSidebar).toBeCalledWith({ type: 'deposit', props: { cdpId: 1 } });
});

describe('on mobile', () => {
  let getComputedStyleOrig;

  beforeAll(() => {
    Object.defineProperty(window.document.documentElement, 'clientWidth', {
      value: 320
    });
    getComputedStyleOrig = window.getComputedStyle;
    window.getComputedStyle = () => ({ fontSize: '16px' });
  });

  afterAll(() => {
    Object.defineProperty(window.document.documentElement, 'clientWidth', {
      value: 0
    });
    window.getComputedStyle = getComputedStyleOrig;
  });

  test('render an action full-screen', async () => {
    const showSidebar = jest.fn();
    const { findByText, getByText, getByTestId } = renderForSidebar(
      <Fragment>
        <Presentation cdp={cdp} account={account} showSidebar={showSidebar} />
        <div id="portal1" />
      </Fragment>
    );
    await waitForElement(() => getByText('Outstanding Dai debt'));
    fireEvent.click(getByText('Deposit'));
    await findByText(/would you like to deposit/);
    expect(showSidebar).not.toBeCalled();
    getByText('New liquidation price');
    const input = getByTestId(
      (content, element) =>
        content === 'deposit-input' && element.tagName.toLowerCase() === 'input'
    );
    fireEvent.change(input, { target: { value: '10000' } });
    getByText(/Insufficient/);
  });
});
