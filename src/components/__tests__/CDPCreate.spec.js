import React from 'react';
import CDPCreate from '../CDPCreate';
import { renderWithAccount } from '../../../test/helpers/render';
import { wait, fireEvent } from '@testing-library/react';
import { instantiateMaker } from '../../maker';
import { mineBlocks } from '@makerdao/test-helpers';
import assert from 'assert';
const { click, change } = fireEvent;

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

jest.mock('react-navi', () => ({
  useCurrentRoute: () => ({ url: { pathname: '/borrow' } })
}));

let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
});

test('the whole flow', async () => {
  const {
    getAllByRole,
    getAllByText,
    getByLabelText,
    getByText,
    findByText
  } = await renderWithAccount(<CDPCreate />);

  getByText('Select a collateral type');

  await mineBlocks(maker.service('web3'));

  const [ethRadioButton] = getAllByRole('radio'); // ETH-A is the first ilk
  await findByText(/94.69 ETH/); // ETH Balance
  click(ethRadioButton);
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
  getByText('1025.96%'); // collateralization ratio
  getAllByRole('checkbox').forEach(click); // terms & privacy
  const openButton = getByText('Open Vault');
  await wait(() => assert(!openButton.disabled));
  click(openButton);

  await wait(() => getByText('Your Vault is being created'));
  await mineBlocks(maker.service('web3'), 5);
  await wait(() => getByText('Your Vault has been created'));

  // expect to be redirected to the new cdp page
  // should be triggered in VaultsProvider
  // expect(mocks.navigation.navigate).toBeCalled();
}, 15000);
