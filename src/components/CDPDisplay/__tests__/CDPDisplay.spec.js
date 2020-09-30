import React from 'react';
import { fireEvent, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ETH, DAI } from '@makerdao/dai-plugin-mcd';
import { mineBlocks } from '@makerdao/test-helpers';

import CDPDisplay from '../';
import { renderWithAccount } from '../../../../test/helpers/render';
import { instantiateMaker } from '../../../maker';
import { SidebarProvider } from '../../../providers/SidebarProvider';
import SidebarBase from 'components/SidebarBase';
import * as navi from 'react-navi';

const { click, change } = fireEvent;
jest.mock('react-navi');
jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

const ILK = 'ETH-A';
const VAULT1_ETH = '5';
const AMOUNT = 210;

let maker;
let web3;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
  web3 = maker.service('web3');
  await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(VAULT1_ETH), DAI(AMOUNT));
});

test('Vault Display page and actions', async () => {
  navi.useCurrentRoute.mockReturnValue({ url: { pathname: '/borrow' } });
  const {
    getByText,
    getAllByText,
    getByTestId,
    findByText,
    findAllByTestId,
    debug // eslint-disable-line no-unused-vars
  } = await renderWithAccount(
    <SidebarProvider>
      <CDPDisplay cdpId="1" />
      <SidebarBase />
    </SidebarProvider>
  );

  await findByText('ETH-A Vault #1', {}, { timeout: 5000 });
  await findByText('Opened a new Vault with id #', {}, { timeout: 5000 });

  /**Wallet Balances */
  const getBalancesEl = () =>
    getByText('Wallet Balances').parentElement.parentElement;
  const getEthBal = () =>
    within(getBalancesEl()).getByText('ETH').nextElementSibling.textContent;
  const getEthUsdValue = () =>
    within(getBalancesEl()).getByText('ETH').nextElementSibling
      .nextElementSibling.textContent;
  const getDaiBal = () =>
    within(getBalancesEl()).getByText('DAI').nextElementSibling.textContent;
  const getDaiUsdValue = () =>
    within(getBalancesEl()).getByText('DAI').nextElementSibling
      .nextElementSibling.textContent;

  // These need to be updated on each different testchain version
  try {
    expect(getEthBal()).toContain('89.');
  } catch (e) {
    expect(getEthBal()).toContain('88.');
  }
  expect(getEthUsdValue()).toContain('$13.2');
  expect(getDaiBal()).toContain('210.');
  expect(getDaiUsdValue()).toBe('$210.00');

  /**Deposit */
  click(getByText('Deposit'));
  await findByText(/would you like to deposit/);

  // wait for proxy check to complete
  await mineBlocks(web3, 5);

  // ETH locked before
  const [, depositLabel] = getAllByText('ETH locked');
  expect(depositLabel.nextElementSibling.textContent).toBe('5.00 ETH');

  // submit deposit
  const depositSidebarInput = (await findAllByTestId('deposit-input'))[2];
  change(depositSidebarInput, { target: { value: '2.33' } });
  const [, depSidebarBtn] = getAllByText('Deposit');

  await waitFor(() => {
    expect(depSidebarBtn).not.toHaveAttribute('disabled');
  });
  click(depSidebarBtn);

  //check event history
  const depEvent = await findByText('2.33', {}, { timeout: 15000 });
  expect(depEvent.parentElement.textContent).toBe(
    'Deposited 2.33 ETH into Vault'
  );

  // check updated balances
  expect(getEthBal()).toContain('85.');
  try {
    expect(getEthUsdValue()).toContain('$13.0');
  } catch (e) {
    expect(getEthUsdValue()).toContain('$12.8');
  }

  /**Generate */
  click(getByText('Generate'));
  await findByText(/would you like to generate/);

  // amount to generate before
  const generateLabel = getByText('Available to generate');
  //expect(generateLabel.nextElementSibling.textContent).toBe('522.99 DAI');
  //Updated to be rounded up due to formatting changes - OK to round up on main display page,
  //correct handling within sidebars still with correct numbers used.
  expect(generateLabel.nextElementSibling.textContent).toBe('523.00 DAI');

  // submit generate
  const generateSidebarInput = (await findAllByTestId('generate-input'))[2];
  change(generateSidebarInput, { target: { value: '25' } });
  const [, genSidebarBtn] = getAllByText('Generate');
  click(genSidebarBtn);

  //check event history
  const genEvent = await findByText('25.00', {}, { timeout: 15000 });
  expect(genEvent.parentElement.textContent).toBe(
    'Generated 25.00 new Dai from Vault'
  );

  // check updated balances
  expect(getDaiBal()).toContain('235.');
  expect(getDaiUsdValue()).toBe('$235.00');

  /**Pay back */
  click(getByText('Pay back'));
  await findByText(/would you like to pay back/);

  // Outstanding Dai debt before
  const [, debtLabel] = getAllByText('Outstanding Dai debt');
  expect(debtLabel.nextElementSibling.textContent).toBe('235.00 DAI');

  // must unlock Dai first
  await waitFor(() => getByTestId('allowance-toggle'));
  const allowanceBtn = getByTestId('allowance-toggle').children[1];
  await waitFor(() => {
    expect(allowanceBtn).not.toHaveAttribute('disabled');
  });
  click(allowanceBtn);
  await findByText('DAI unlocked');

  // submit pay back
  const paybackSidebarInput = (await findAllByTestId('payback-input'))[2];
  change(paybackSidebarInput, { target: { value: '1.23' } });
  const [, pbSidebarBtn] = getAllByText('Pay back');

  // wait for hasProxy check to complete
  await waitFor(() => {
    expect(pbSidebarBtn).not.toHaveAttribute('disabled');
  });
  click(pbSidebarBtn);

  //check event history
  const pbEvent = await findByText('1.23', {}, { timeout: 15000 });
  expect(pbEvent.parentElement.textContent).toBe('Repaid 1.23 Dai to Vault');

  // check updated balances
  expect(getDaiBal()).toContain('233.');
  expect(getDaiUsdValue()).toBe('$233.77');

  /**Withdraw */
  click(getByText('Withdraw'));
  await findByText(/would you like to withdraw/);

  // amount to withdraw before
  expect(getByText('Able to withdraw').nextElementSibling.textContent).toBe(
    '4.99 ETH'
  );

  // submit withdraw
  const withdrawSidebarInput = (await findAllByTestId('withdraw-input'))[2];
  change(withdrawSidebarInput, { target: { value: '2' } });
  const [, wdSidebarBtn] = getAllByText('Withdraw');
  click(wdSidebarBtn);

  //check event history
  const wdEvent = await findByText(/Withdrew/, {}, { timeout: 15000 });
  expect(wdEvent.textContent).toBe('Withdrew 2.00 ETH from Vault');

  // check updated balances
  try {
    expect(getEthBal()).toContain('88.');
  } catch {
    expect(getEthBal()).toContain('87.');
  }

  expect(getEthUsdValue()).toContain('$13.1');
}, 45000);
