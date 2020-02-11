import React from 'react';
import * as navi from 'react-navi';
import assert from 'assert';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {
  wait,
  fireEvent,
  waitForElement,
  cleanup
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MDAI, ETH } from '@makerdao/dai-plugin-mcd';

import Save from '../Save';
import {
  renderWithAccount,
  renderWithMaker
} from '../../../test/helpers/render';
import { instantiateMaker } from '../../maker';
import { SidebarProvider } from '../../providers/SidebarProvider';
import SidebarBase from 'components/SidebarBase';

const { click, change } = fireEvent;

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

jest.mock('react-navi');
navi.useCurrentRoute.mockReturnValue({
  url: { search: '?network=testnet', pathname: '/test' }
});
navi.Link = styled.a``;

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
    getByRole,
    findByText
  } = await renderWithAccount(
    <SidebarProvider>
      <Save />
      <SidebarBase />
    </SidebarProvider>
  );

  // Wait for page to render
  await waitForElement(() => getByText('Savings'));
  // Initial DSR balance
  getByText('DAI locked in DSR');
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

  /**Deposit */
  click(getByTestId('sidebar-deposit-button'));
  await findByText(/would you like to deposit/);

  // Unlock dai to continue
  const [allowanceToggle] = getAllByTestId('allowance-toggle');
  click(allowanceToggle.children[1]);
  await waitForElement(() => getByText('DAI unlocked'));

  // Input amount to deposit and click
  const depositInput = getByRole('textbox');
  change(depositInput, { target: { value: '21.123456789' } });
  click(getByTestId('deposit-button'));

  // Balance and history table update after deposit
  await wait(() => getByText('21.12345', { exact: false }));
  await wait(() => getByText(/Deposited/));

  /**Withdraw */
  click(getByTestId('sidebar-withdraw-button'));
  await findByText(/would you like to withdraw/);

  // Input amount to withdraw and click
  const withdrawInput = getByRole('textbox');
  change(withdrawInput, { target: { value: '7' } });
  click(getByTestId('withdraw-button'));

  // Balance and history table update after withdraw
  await wait(() => getByText('14.12345', { exact: false }));
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
          allowances: { MDAI: 10 },
          balances: { MDAI: BigNumber(50), DSR: BigNumber(0) }
        }
      }
    };
    return newState;
  };
  const { getByText, findByText, getByRole, getByTestId } = renderWithMaker(
    <SidebarProvider>
      <Save />
      <SidebarBase />
    </SidebarProvider>,
    setupMockState
  );

  await findByText('Savings');
  click(getByTestId('sidebar-deposit-button'));
  await findByText(/would you like to deposit/);

  const depositInput = getByRole('textbox');
  expect(depositInput.disabled).toBe(false);

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
        '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6': {
          allowances: { MDAI: 0 },
          balances: { MDAI: BigNumber(50), DSR: BigNumber(0) }
        }
      }
    };
    return newState;
  };
  const { getAllByText, findByText, getByTestId, getByRole } = renderWithMaker(
    <SidebarProvider>
      <Save />
      <SidebarBase />
    </SidebarProvider>,
    setupMockState
  );

  await findByText('Savings');
  click(getByTestId('sidebar-deposit-button'));
  await waitForElement(() => getAllByText('Unlock DAI to continue'));

  const depositInput = getByRole('textbox');
  expect(depositInput.disabled).toBe(true);
});
