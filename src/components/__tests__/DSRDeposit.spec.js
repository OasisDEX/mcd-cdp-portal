import React from 'react';
import assert from 'assert';
import { wait, fireEvent, waitForElement } from '@testing-library/react';
import { MDAI, ETH } from '@makerdao/dai-plugin-mcd';
import { mineBlocks } from '@makerdao/test-helpers';

import DSRDeposit from '../DSRDeposit';
import lang from '../../languages';
import { renderWithMaker } from '../../../test/helpers/render';
import { instantiateMaker } from '../../maker';
import useMaker from '../../hooks/useMaker';
import { prettifyNumber } from '../../utils/ui';

const { click, change } = fireEvent;

const AMOUNT = 80.1234567;
const ILK = 'ETH-A';
let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
  await await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(1), MDAI(AMOUNT));
});

function WaitForAccount({ children, callback }) {
  const { account } = useMaker();
  callback(account);
  return account ? children : null;
}

test('the whole DSR Deposit flow', async () => {
  const hideOnboarding = jest.fn();
  let account;
  const { getAllByText, getByRole, getByText } = renderWithMaker(
    <WaitForAccount
      callback={a => {
        account = a;
      }}
    >
      <DSRDeposit hideOnboarding={hideOnboarding} />
    </WaitForAccount>,
    state => state
  );
  await waitForElement(() => account);
  getByText(lang.dsr_deposit.open_vault);

  // First checkmark is proxy, but need to set allowance for Dai
  await wait(() => getByText('checkmark.svg'));
  click(getByText('Set'));

  // Allowance is now set, continue to DepositCreate step
  await wait(() => assert(getAllByText('checkmark.svg').length === 2));
  click(getByText(lang.actions.continue));

  // UI Formats the amount
  await waitForElement(() => getByText(`${prettifyNumber(AMOUNT)} DAI`));
  getByText(lang.dsr_deposit.deposit_form_title);

  // Test input validation
  const input = getByRole('textbox');
  expect(input.value).toBe('');
  change(input, { target: { value: AMOUNT + 1 } });
  await waitForElement(() =>
    getByText(
      lang.formatString(lang.action_sidebar.insufficient_balance, 'DAI')
    )
  );

  // Test setmax button
  fireEvent.click(getByText(lang.set_max));
  expect(input.value).toBe(AMOUNT.toString());

  // Continue and move to confirmation step
  click(getByText(lang.actions.continue));

  getByText(lang.save.deposit_amount);
  getByText(`${prettifyNumber(AMOUNT)} DAI`);

  // Agree to terms to enable deposit button
  click(getByRole('checkbox'));

  const depositButton = getByText(lang.actions.deposit);
  await wait(() => assert(!depositButton.disabled));

  click(depositButton);

  await wait(() =>
    getByText(
      /The estimated time is [0-9]+ seconds. You can safely leave this page./
    )
  );
  await mineBlocks(maker.service('web3'), 5);
  // The message changes after confirmation
  await wait(() => getByText('You can safely leave this page.'));
}, 15000);
