import React from 'react';
import CDPDisplay from '../';
import { cleanup, waitForElement, fireEvent } from '@testing-library/react';
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
        balances: { ETH: new BigNumber(ACCT_BAL) }
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
  const { getByText, findByText, getByRole } = await renderWithAccount(
    <SidebarProvider>
      <CDPDisplay cdpId="1" />
      <SidebarBase />
    </SidebarProvider>,
    prepState,
    identityReducer
  );

  await waitForElement(() => getByText('Vault history'));
  getByText('ETH-A Vault #1');

  click(getByText('Deposit'));
  await findByText(/would you like to deposit/);

  // Initial liquidation & collateral ratio values update with input
  getByText('84.08 ETH/USD');
  getByText('356.80%');

  const input = getByRole('textbox');
  change(input, { target: { value: '3' } });

  getByText('52.55 ETH/USD');
  getByText('570.88%');
});
