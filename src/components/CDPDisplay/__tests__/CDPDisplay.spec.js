import React from 'react';
import CDPDisplay from '../';
import { cleanup, fireEvent, within } from '@testing-library/react';
import { MDAI, ETH } from '@makerdao/dai-plugin-mcd';
import { renderWithAccount } from '../../../../test/helpers/render';
import { instantiateMaker } from '../../../maker';
import { SidebarProvider } from '../../../providers/SidebarProvider';
import SidebarBase from 'components/SidebarBase';
import * as navi from 'react-navi';

const { click, change } = fireEvent;
jest.mock('react-navi');

const ILK = 'ETH-A';
const VAULT1_ETH = '5';
const AMOUNT = 210;

let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
  await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(VAULT1_ETH), MDAI(AMOUNT));
});

afterEach(cleanup);

test('Vault Display page and actions', async () => {
  navi.useCurrentRoute.mockReturnValue({ url: { pathname: '/borrow' } });
  const {
    getByText,
    findByText,
    getByRole,
    getAllByText,
    debug // eslint-disable-line no-unused-vars
  } = await renderWithAccount(
    <SidebarProvider>
      <CDPDisplay cdpId="1" />
      <SidebarBase />
    </SidebarProvider>
  );

  await findByText('ETH-A Vault #1');
  await findByText('Opened a new Vault with id #', {}, { timeout: 15000 });

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

  expect(getEthBal()).toContain('70.');
  expect(getEthUsdValue()).toBe('$10.6K');
  expect(getDaiBal()).toContain('210.');
  expect(getDaiUsdValue()).toBe('$210.00');

  /**Withdraw */
  click(getByText('Withdraw'));
  await findByText(/would you like to withdraw/);

  // amount to withdraw before
  expect(getByText('Able to withdraw').nextElementSibling.textContent).toBe(
    '2.9 ETH'
  );

  // submit withdraw
  change(getByRole('textbox'), { target: { value: '2' } });
  const [, wdSidebarBtn] = getAllByText('Withdraw');
  click(wdSidebarBtn);

  //check event history
  const wdEvent = await findByText(/Withdrew/, {}, { timeout: 15000 });
  expect(wdEvent.textContent).toBe('Withdrew 2.0000 ETH from Vault');

  // check updated balances
  expect(getEthBal()).toContain('72.');
  expect(getEthUsdValue()).toBe('$10.9K');

  /**Generate */
  click(getByText('Generate'));
  await findByText(/would you like to generate/);

  // amount to generate before
  const generateLabel = getByText('Available to generate');
  expect(generateLabel.nextElementSibling.textContent).toBe('90 DAI');

  // submit generate
  change(getByRole('textbox'), { target: { value: '25' } });
  const [, genSidebarBtn] = getAllByText('Generate');
  click(genSidebarBtn);

  //check event history
  const genEvent = await findByText('25.0000', {}, { timeout: 15000 });
  expect(genEvent.parentElement.textContent).toBe(
    'Generated 25.0000 new Dai from Vault'
  );

  // check updated balances
  expect(getDaiBal()).toContain('235.');
  expect(getDaiUsdValue()).toBe('$235.00');

  /**Deposit */
  click(getByText('Deposit'));
  await findByText(/would you like to deposit/);
  // ETH locked before
  const [, depositLabel] = getAllByText('ETH locked');
  expect(depositLabel.nextElementSibling.textContent).toBe('3 ETH');

  /**Pay back */
  click(getByText('Pay back'));
  await findByText(/would you like to pay back/);
  // Outstanding Dai debt before
  const [, debtLabel] = getAllByText('Outstanding Dai debt');
  expect(debtLabel.nextElementSibling.textContent).toBe('235 DAI');
}, 45000);
