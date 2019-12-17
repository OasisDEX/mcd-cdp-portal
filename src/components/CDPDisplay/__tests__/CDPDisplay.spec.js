import React, { Fragment } from 'react';
import CDPDisplay from '../';
import { cleanup, waitForElement } from '@testing-library/react';
import { MDAI, ETH, BAT, USD } from '@makerdao/dai-plugin-mcd';

import { renderWithAccount } from '../../../../test/helpers/render';
import { instantiateMaker } from '../../../maker';
import { createCurrencyRatio } from '@makerdao/currency';
import { SidebarProvider } from '../../../providers/SidebarProvider';
import { BigNumber } from 'bignumber.js';

const ILK = 'ETH-A';
const VAULT1_ETH = '1';
const VAULT1_ART = '21';
const AMOUNT = 21;

const PAR = new BigNumber('1000000000000000000000000000');

const DEBT_CEILING = '1000';
const RATE = '1.000967514019988230';
const DUST = '20';
const PRICE = createCurrencyRatio(USD, BAT)('0.24');
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
        balances: { ETH: 3 },
        allowances: {},
        cdps: [{ id: 1 }]
      }
    },
    feeds: [
      {
        key: ILK,
        currency: ETH,
        dust: DUST,
        rate: RATE,
        feedValueUSD: PRICE,
        debtCeiling: DEBT_CEILING,
        liquidationRatio: LIQUIDATION_RATIO
      }
    ],
    system: {
      par: PAR
    }
  };
}

afterEach(cleanup);
const identityReducer = x => x;

test('cdp actions', async () => {
  const { getByText, getAllByText } = await renderWithAccount(
    <Fragment>
      <SidebarProvider>
        <CDPDisplay cdpId="1" />
      </SidebarProvider>
      <div id="portal1" />
    </Fragment>,
    prepState,
    identityReducer
  );

  await waitForElement(() => getAllByText('Outstanding Dai debt'));
  await waitForElement(() => getByText('Vault history'));

  getByText('ETH-A Vault #1');
  getByText('Deposit');
  getByText('Withdraw');
  getByText('Pay back');
  getByText('Generate');
});
