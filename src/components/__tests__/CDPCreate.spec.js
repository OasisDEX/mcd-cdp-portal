import React, { useEffect, useState } from 'react';
import CDPCreate from '../CDPCreate';
import { renderWithAccount } from '../../../test/helpers/render';
import { waitFor, fireEvent } from '@testing-library/react';
import { mineBlocks, TestAccountProvider } from '@makerdao/test-helpers';
import assert from 'assert';
import useMaker from 'hooks/useMaker';
const { click, change } = fireEvent;

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

jest.mock('react-navi', () => ({
  useCurrentRoute: () => ({ url: { pathname: '/borrow' } })
}));

let web3;

const RenderNoProxyAccount = () => {
  const [changedAccount, setAccountChanged] = useState(false);
  const { maker } = useMaker();
  web3 = maker.service('web3');

  const changeAccount = async () => {
    const accountService = maker.service('accounts');
    TestAccountProvider.setIndex(345);
    const { key } = TestAccountProvider.nextAccount();
    await accountService.addAccount('noproxy', { type: 'privateKey', key });
    accountService.useAccount('noproxy');
    setAccountChanged(true);
  };

  useEffect(() => {
    changeAccount();
  }, []);

  return changedAccount ? <CDPCreate onClose={() => {}} /> : <div />;
};

test('the whole flow', async () => {
  const {
    getAllByRole,
    getAllByText,
    getByLabelText,
    getByText,
    findByText,
    findByTestId,
    unmount
  } = await renderWithAccount(<RenderNoProxyAccount />);

  await findByText('Select a collateral type', {}, { timeout: 3000 });

  // Wait for balances & collateral data
  await mineBlocks(web3);

  const ethRadioButton = await findByTestId('radio-ETH-A'); // ETH-A is the first ilk
  await findByText(/100.00 ETH/); // ETH Balance
  click(ethRadioButton);
  click(getByText('Continue'));

  // Setup Proxy & Allowance page
  getByText('Vault Setup and Management');
  click(getByText('Setup'));

  // Must wait for proxy to be confirmed
  await mineBlocks(web3, 15);
  await findByText('Confirmed with 10 confirmations');

  await waitFor(() => expect(getAllByText('checkmark.svg').length).toEqual(2));
  click(getByText('Continue'));

  // Deposit and Generate form
  getByText('Deposit ETH and Generate Dai');
  change(getByLabelText('ETH'), { target: { value: '5.12845673' } });
  change(getByLabelText('DAI'), { target: { value: '131.11911157' } });
  const continueButton = getByText('Continue');
  await waitFor(() => assert(!continueButton.disabled));
  click(continueButton);

  // Confirmation page
  getByText('Confirm Vault Details');
  await findByText('5.128 ETH');
  await findByText('131.119 DAI');
  await findByText('586.69%'); // collateralization ratio
  getAllByRole('checkbox').forEach(click); // terms & privacy
  const openButton = getByText('Open Vault');
  await waitFor(() => assert(!openButton.disabled));
  click(openButton);

  await waitFor(() => getByText('Your Vault is being created'));
  await mineBlocks(web3);
  await waitFor(() => getByText('Your Vault has been created'));

  // expect to be redirected to the new cdp page
  // should be triggered in VaultsProvider
  // expect(mocks.navigation.navigate).toBeCalled();

  unmount();
}, 20000);
