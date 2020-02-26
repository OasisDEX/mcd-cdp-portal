import React, { useEffect, useState } from 'react';
import CDPCreate from '../CDPCreate';
import { renderWithAccount } from '../../../test/helpers/render';
import { wait, fireEvent } from '@testing-library/react';
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
    unmount
  } = await renderWithAccount(<RenderNoProxyAccount />);

  getByText('Select a collateral type');

  // Wait for balances & collateral data
  await mineBlocks(web3);

  const [ethRadioButton] = getAllByRole('radio'); // ETH-A is the first ilk
  await findByText(/100 ETH/); // ETH Balance
  click(ethRadioButton);
  click(getByText('Continue'));

  // Setup Proxy & Allowance page
  getByText('Vault Setup and Management');
  click(getByText('Setup'));

  // Must wait for proxy to be confirmed
  await mineBlocks(web3, 15);
  await findByText('Confirmed with 10 confirmations');

  await wait(() => assert(getAllByText('checkmark.svg').length === 2));
  click(getByText('Continue'));

  // Deposit and Generate form
  getByText('Deposit ETH and Generate Dai');
  change(getByLabelText('ETH'), { target: { value: '2.12845673' } });
  change(getByLabelText('DAI'), { target: { value: '31.11911157' } });
  const continueButton = getByText('Continue');
  await wait(() => assert(!continueButton.disabled));
  click(continueButton);

  // Confirmation page
  getByText('Confirm Vault Details');
  getByText('2.128 ETH');
  getByText('31.119 DAI');
  getByText('1025.95%'); // collateralization ratio
  getAllByRole('checkbox').forEach(click); // terms & privacy
  const openButton = getByText('Open Vault');
  await wait(() => assert(!openButton.disabled));
  click(openButton);

  await wait(() => getByText('Your Vault is being created'));
  await mineBlocks(web3);
  await wait(() => getByText('Your Vault has been created'));

  // expect to be redirected to the new cdp page
  // should be triggered in VaultsProvider
  // expect(mocks.navigation.navigate).toBeCalled();

  unmount();
}, 20000);
