import React from 'react';
import assert from 'assert';
import {
  wait,
  fireEvent,
  waitForElement,
  cleanup
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MDAI, ETH } from '@makerdao/dai-plugin-mcd';

import Save from '../Save';
import { renderWithMaker } from '../../../test/helpers/render';
import { instantiateMaker } from '../../maker';

const { click, change } = fireEvent;

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

const AMOUNT = 80.1234567;
const ILK = 'ETH-A';
let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
  await await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(1), MDAI(AMOUNT));
});

afterEach(cleanup);

test('render save page and perform deposit and withdraw actions', async () => {
  const {
    getAllByText,
    getByTestId,
    getAllByTestId,
    getByText,
    getAllByRole,
    findByText
  } = renderWithMaker(<Save />);

  // Wait for page to render
  await waitForElement(() => getByText('Balance'));

  // Initial balance
  getByText('0.0000 USD');
  // Savings to date
  getByText('Savings earned to date');
  // Dai Savings Rate
  await findByText('1.00%');
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

test('cannot deposit more than token allowance', async () => {
  const setupMockState = state => {
    const newState = {
      ...state,
      accounts: {
        [maker.currentAddress()]: {
          allowances: { MDAI: 10 }
        }
      }
    };
    return newState;
  };
  const { getByText, findByText, getAllByRole } = renderWithMaker(
    <Save />,
    setupMockState
  );

  await findByText('Balance');
  const [depositInput, withdrawInput] = getAllByRole('textbox');

  expect(depositInput.disabled).toBe(false);
  expect(withdrawInput.disabled).toBe(false);

  change(depositInput, { target: { value: '20' } });
  const warningEl = getByText('Amount is higher than your allowance for DAI');
  change(depositInput, { target: { value: '10' } });
  expect(warningEl).not.toBeInTheDocument();
});

test('if allowance is 0, show toggle & disable input', async () => {
  const setupMockState = state => {
    const newState = {
      ...state,
      accounts: {
        [maker.currentAddress()]: {
          allowances: { MDAI: 0 }
        }
      }
    };
    return newState;
  };
  const { getAllByText, getAllByRole } = renderWithMaker(
    <Save />,
    setupMockState
  );

  await waitForElement(() => getAllByText('Unlock DAI to continue'));
  const [depositInput, withdrawInput] = getAllByRole('textbox');

  expect(depositInput.disabled).toBe(true);
  expect(withdrawInput.disabled).toBe(true);
});
