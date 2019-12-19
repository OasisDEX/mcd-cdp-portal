import React from 'react';
import CDPDisplay from '../';
import { cleanup, fireEvent, within } from '@testing-library/react';
import { MDAI, ETH, USD } from '@makerdao/dai-plugin-mcd';
import { renderWithAccount } from '../../../../test/helpers/render';
import { instantiateMaker } from '../../../maker';
import { createCurrencyRatio } from '@makerdao/currency';
import { SidebarProvider } from '../../../providers/SidebarProvider';
import { BigNumber } from 'bignumber.js';
import SidebarBase from 'components/SidebarBase';
import * as navi from 'react-navi';

const { click, change } = fireEvent;
jest.mock('react-navi');

const ILK = 'ETH-A';
const VAULT1_ETH = '5';
const VAULT1_ART = '210';
const AMOUNT = 210;

const ACCT_BAL = 3;
const RATE = '1.000967514019988230';
const PRICE = createCurrencyRatio(USD, ETH)('150');
const LIQUIDATION_RATIO = '200';

let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
  await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(VAULT1_ETH), MDAI(AMOUNT));
});

function prepState(state) {
  return {
    ...state,
    cdps: {
      1: {
        ilk: ILK,
        ink: VAULT1_ETH,
        art: VAULT1_ART,
        inited: true
      }
    },
    accounts: {
      [maker.currentAddress()]: {
        balances: { ETH: new BigNumber(ACCT_BAL) },
        allowances: { MDAI: '5000', DAI: '5000' }
      }
    },
    feeds: [
      {
        key: ILK,
        currency: ETH,
        rate: RATE,
        feedValueUSD: PRICE,
        liquidationRatio: LIQUIDATION_RATIO
      }
    ]
  };
}

afterEach(cleanup);
const identityReducer = x => x;

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
    </SidebarProvider>,
    prepState,
    identityReducer
  );
  await findByText('ETH-A Vault #1');

  /**Wallet Balances */
  const balancesEl = getByText('Wallet Balances').parentElement.parentElement;
  expect(
    within(balancesEl).getByText('ETH').nextElementSibling.textContent
  ).toBe('3.0000');
  expect(
    within(balancesEl).getByText('ETH').nextElementSibling.nextElementSibling
      .textContent
  ).toBe('$450.00');

  /**Deposit */
  click(getByText('Deposit'));
  await findByText(/would you like to deposit/);
  // ETH locked before
  const [, depositLabel] = getAllByText('ETH locked');
  expect(depositLabel.nextElementSibling.textContent).toBe('5 ETH');
  //TODO figure out why component doesn't receive proxy
  // change(getByRole('textbox'), { target: { value: '3' } });

  /**Withdraw */
  click(getByText('Withdraw'));
  await findByText(/would you like to withdraw/);

  // amount to withdraw before
  expect(getByText('Able to withdraw').nextElementSibling.textContent).toBe(
    '2.2 ETH'
  );

  // submit and check event history
  change(getByRole('textbox'), { target: { value: '2' } });
  const [, wdSidebarBtn] = getAllByText('Withdraw');
  click(wdSidebarBtn);
  const wdEvent = await findByText(/Withdrew/, {}, { timeout: 15000 });
  expect(wdEvent.textContent).toBe('Withdrew 2.0000 ETH from Vault');

  /**Generate */
  click(getByText('Generate'));
  await findByText(/would you like to generate/);

  // amount to generate before
  const generateLabel = getByText('Available to generate');
  expect(generateLabel.nextElementSibling.textContent).toBe('164.8 DAI');

  // submit and check event history
  change(getByRole('textbox'), { target: { value: '1' } });
  const [, genSidebarBtn] = getAllByText('Generate');
  click(genSidebarBtn);
  const genEvent = await findByText('1.0000', {}, { timeout: 15000 });
  expect(genEvent.parentElement.textContent).toBe(
    'Generated 1.0000 new Dai from Vault'
  );

  /**Pay back */
  click(getByText('Pay back'));
  await findByText(/would you like to pay back/);
  // Outstanding Dai debt before
  const [, debtLabel] = getAllByText('Outstanding Dai debt');
  expect(debtLabel.nextElementSibling.textContent).toBe('210.2 DAI');
  //TODO component doesn't update with proxy
  // change(getByRole('textbox'), { target: { value: '1' } });
  // const [, pbSidebarBtn] = getAllByText('Pay back');
  // click(pbSidebarBtn);
}, 30000);
