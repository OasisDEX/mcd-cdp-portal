import React from 'react';
import assert from 'assert';
import { wait, fireEvent, waitForElement, act } from '@testing-library/react';
import { MDAI } from '@makerdao/dai-plugin-mcd';

import DSRDeposit from '../DSRDeposit';
import lang from '../../languages';
import { renderWithMaker } from '../../../test/helpers/render';
import { instantiateMaker } from '../../maker';
import useMaker from '../../hooks/useMaker';
import useProxy from '../../hooks/useProxy';
import useTokenAllowance from '../../hooks/useTokenAllowance';
import useWalletBalances from '../../hooks/useWalletBalances';
const { click } = fireEvent;

jest.mock('../../hooks/useTokenAllowance');
jest.mock('../../hooks/useWalletBalances');

const BALANCE = 1;
let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
});

function WaitForAccount({ children, callback }) {
  const { account } = useMaker();
  const { proxyAddress } = useProxy();
  callback({ account });
  return account && proxyAddress ? children : null;
}

function prepState(state) {
  return {
    ...state,
    accounts: {
      [maker.currentAddress()]: {
        balances: { ETH: '3', MDAI: '100' },
        allowances: {}
      }
    }
  };
}

test('the whole DSR Deposit flow', async () => {
  useTokenAllowance.mockReturnValue({ hasAllowance: true });
  useWalletBalances.mockReturnValue({ MDAI: MDAI(BALANCE) });

  const hideOnboarding = jest.fn();
  let account;
  const { getAllByText, getByRole, getByText } = renderWithMaker(
    <WaitForAccount
      callback={({ account: a }) => {
        account = a;
      }}
    >
      <DSRDeposit hideOnboarding={hideOnboarding} />
    </WaitForAccount>,
    prepState
  );
  await waitForElement(() => account);

  getByText(lang.dsr_deposit.open_vault);

  // Proxy and allowances are set
  await wait(() => assert(getAllByText('checkmark.svg').length === 2));

  act(() => {
    click(getByText(lang.actions.continue));
  });

  // Enter deposit amount
  getByText(lang.dsr_deposit.deposit_form_title);
  await waitForElement(() => getByText(/1,000,000 DAI/));
  const setMax = await waitForElement(() => getByText(lang.set_max));
  const input = getByRole('textbox');
  expect(input.value).toBe('');

  act(() => {
    fireEvent.click(setMax);
  });
  expect(input.value).toBe(BALANCE.toString());

  // Continue and move to confirmation step
  act(() => {
    click(getByText(lang.actions.continue));
  });

  getByText(lang.save.deposit_amount);
  getByText(`${BALANCE} DAI`);

  // Agree to terms to enable button
  act(() => {
    click(getByRole('checkbox'));
  });
  const depositButton = getByText(lang.actions.deposit);
  await wait(() => assert(!depositButton.disabled));

  // TODO set DAI allowance in test & open a CDP first to get DAI to finish flow.
}, 15000);
