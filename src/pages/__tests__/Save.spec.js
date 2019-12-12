import React from 'react';
import assert from 'assert';
import {
  wait,
  fireEvent,
  waitForElement,
  cleanup
} from '@testing-library/react';
import { MDAI, ETH } from '@makerdao/dai-plugin-mcd';
import '@testing-library/jest-dom/extend-expect';

// TODO: fix error when importing this
// import Save from '../Save';

import { renderWithMaker } from '../../../test/helpers/render';
import { instantiateMaker } from '../../maker';

const { click, change } = fireEvent;

const AMOUNT = 80.1234567;
const ILK = 'ETH-A';
let maker;

const originalConsoleError = console.error;

beforeAll(async () => {
  console.error = jest.fn();
  maker = await instantiateMaker({ network: 'testnet' });
  await await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(1), MDAI(AMOUNT));
});

afterAll(() => {
  console.error = originalConsoleError;
});

afterEach(cleanup);

test.skip('render save page and perform deposit and withdraw actions', async () => {
  const {
    getAllByText,
    getByTestId,
    getAllByTestId,
    getByText,
    getAllByRole
  } = renderWithMaker(<Save />);

  // Wait for page to render
  await waitForElement(() => getByText('Balance'));

  // Initial balance
  getByText('0.0000 USD');
  // Savings to date
  getByText('Savings to date');
  // Dai Savings Rate
  getByText('1.00%');
  // Privacy policy
  getByText('privacy policy');
  // CTA in history table when empty
  await wait(() =>
    getByText('Deposit Dai to see your first transaction and start earning')
  );

  // Unlock dai to continue
  const [allowanceToggle] = getAllByTestId('allowance-toggle');
  click(allowanceToggle.children[1]);
  await waitForElement(() => getByText('DAI unlocked'));

  // Input amount to deposit and click
  const [depositInput, withdrawInput] = getAllByRole('textbox');
  change(depositInput, { target: { value: '21.123456789' } });
  click(getByTestId('deposit-button'));

  // Balance and history table update after deposit
  await wait(() => getByText('21.1235 USD'));
  await wait(() => getByText(/Deposited/));

  // Input amount to withdraw and click
  change(withdrawInput, { target: { value: '7' } });
  click(getByTestId('withdraw-button'));

  // Balance and history table update after withdraw
  await wait(() => getByText('14.1235 USD'));
  await wait(() => getByText(/Withdrew/));

  // Two entries in the history table
  await wait(() => assert(getAllByText('external-link.svg').length === 2));
}, 15000);
