import React from 'react';
import CDPCreate from '../CDPCreate';
import { renderWithMaker, mocks } from '../../../test/helpers/render';
import { wait, fireEvent, waitForElement } from '@testing-library/react';
import { instantiateMaker } from '../../maker';
import useMaker from '../../hooks/useMaker';
import BigNumber from 'bignumber.js';
import { mineBlocks } from '@makerdao/test-helpers';
import assert from 'assert';
const { click, change } = fireEvent;

let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
});

function WaitForAccount({ children, callback }) {
  const { account } = useMaker();
  callback(account);
  return account ? children : null;
}

function prepState(state) {
  Object.assign(state.feeds.find(f => f.key === 'ETH-A'), {
    liquidationRatio: '150',
    debtCeiling: '1000000',
    feedValueUSD: BigNumber(200)
  });
  return {
    ...state,
    accounts: {
      [maker.currentAddress()]: {
        balances: { ETH: 3 },
        allowances: {}
      }
    }
  };
}

test('the whole flow', async () => {
  let account;
  const {
    getAllByRole,
    getAllByText,
    getByLabelText,
    getByRole,
    getByText
  } = renderWithMaker(
    <WaitForAccount
      callback={a => {
        account = a;
      }}
    >
      <CDPCreate />
    </WaitForAccount>,
    prepState
  );
  await waitForElement(() => account);

  getByText('Select a collateral type');
  click(getByRole('radio')); // ETH-A is the only ilk shown
  click(getByText('Continue'));

  getByText('Vault Setup and Management');
  // this assumes the user already has proxy and allowances set up
  await wait(() => assert(getAllByText('checkmark.svg').length === 2));
  click(getByText('Continue'));

  getByText('Deposit ETH and Generate Dai');
  change(getByLabelText('ETH'), { target: { value: '2.12845673' } });
  change(getByLabelText('DAI'), { target: { value: '31.11911157' } });
  const continueButton = getByText('Continue');
  await wait(() => assert(!continueButton.disabled));
  click(continueButton);

  getByText('Confirm Vault Details');
  getByText('2.128 ETH');
  getByText('31.119 DAI');
  getByText('1367.94%'); // collateralization ratio
  getAllByRole('checkbox').forEach(click); // terms & privacy
  const openButton = getByText('Open Vault');
  await wait(() => assert(!openButton.disabled));
  click(openButton);

  await wait(() => getByText('Your Vault is being created'));
  await mineBlocks(maker.service('web3'), 5);
  await wait(() => getByText('Your Vault has been created'));

  // expect to be redirected to the new cdp page
  expect(mocks.navigation.navigate).toBeCalled();
}, 15000);
