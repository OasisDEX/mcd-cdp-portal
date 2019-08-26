import React, { useEffect, useState } from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Payback, { ProxyAndAllowanceCheck } from '../Payback';
import { mineBlocks } from '@makerdao/test-helpers';
import { TestAccountProvider } from '../../../../node_modules/@makerdao/test-helpers/dist/TestAccountProvider';
import testAccounts from '../../../../node_modules/@makerdao/test-helpers/dist/testAccounts.json';
import { renderForSidebar as render } from '../../../../test/helpers/render';
import useMaker from '../../../hooks/useMaker';
import lang from '../../../languages';

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = render(<Payback cdpId="1" />);

  // this waits for the initial proxy & allowance check to finish
  await waitForElement(() => getByText(/Unlock DAI/));

  // these throw errors if they don't match anything
  getByText('Pay Back DAI');
  getByText('7.5 DAI'); // art * rate
});

let _web3;

const SetupProxyAndAllowance = () => {
  const [changedAccount, setAccountChanged] = useState(false);
  const { maker, account, newTxListener } = useMaker();
  const [hasAllowance, setHasAllowance] = useState(false);
  _web3 = maker.service('web3');

  const accountProvider = new TestAccountProvider(testAccounts);
  accountProvider.setIndex(1);
  const { key: pkey } = accountProvider.nextAccount();
  const accountService = maker.service('accounts');

  const changeAccount = async () => {
    await accountService.addAccount('no proxy account', {
      type: 'privateKey',
      key: pkey
    });
    accountService.useAccount('no proxy account');
    setAccountChanged(true);
  };

  useEffect(() => {
    changeAccount();
  }, []);

  return (
    <>
      {changedAccount ? (
        <ProxyAndAllowanceCheck
          {...{
            maker,
            account,
            newTxListener,
            hasAllowance,
            setHasAllowance
          }}
        />
      ) : (
        <div />
      )}
    </>
  );
};

test('proxy toggle', async () => {
  const { getByTestId } = render(<SetupProxyAndAllowance />);
  const [proxyToggle, allowanceToggle] = await Promise.all([
    waitForElement(() => getByTestId('proxy-toggle')),
    waitForElement(() => getByTestId('allowance-toggle'))
  ]);

  expect(proxyToggle).toHaveTextContent(lang.action_sidebar.create_proxy);
  expect(allowanceToggle).toHaveTextContent(
    lang.formatString(lang.action_sidebar.unlock_token, 'DAI')
  );

  const proxyButton = proxyToggle.children[1];
  const allowanceButton = allowanceToggle.children[1];
  expect(proxyButton).toBeEnabled();
  expect(allowanceButton).toBeDisabled();

  act(() => {
    fireEvent.click(proxyButton);
  });

  expect(proxyToggle).toHaveTextContent(lang.action_sidebar.creating_proxy);
  await mineBlocks(_web3);
  expect(proxyToggle).toHaveTextContent(lang.action_sidebar.proxy_created);
  expect(allowanceToggle.children[1]).toBeEnabled();
});

test('allowance toggle', async () => {
  const { getByTestId, queryByTestId } = render(<SetupProxyAndAllowance />);

  await waitForElement(() => getByTestId('toggle-container'));
  expect(queryByTestId('proxy-toggle')).toBeNull();
  expect(queryByTestId('allowance-toggle')).not.toBeNull();

  const allowanceToggle = getByTestId('allowance-toggle');
  const allowanceButton = allowanceToggle.children[1];

  act(() => {
    fireEvent.click(allowanceButton);
  });

  expect(allowanceToggle).toHaveTextContent(
    lang.formatString(lang.action_sidebar.unlocking_token, 'DAI')
  );
  await mineBlocks(_web3);
  expect(allowanceToggle).toHaveTextContent(
    lang.formatString(lang.action_sidebar.token_unlocked, 'DAI')
  );
});
