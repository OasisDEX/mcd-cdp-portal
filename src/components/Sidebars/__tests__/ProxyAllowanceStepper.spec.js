import React, { useEffect, useState } from 'react';
import ProxyAllowanceStepper from '../shared/ProxyAllowanceStepper';
import { renderWithMaker } from '../../../../test/helpers/render';
import {
  TestAccountProvider,
  takeSnapshot,
  restoreSnapshot,
  mineBlocks
} from '@makerdao/test-helpers';
import '@testing-library/jest-dom/extend-expect';
import useMaker from 'hooks/useMaker';
import { wait, waitForElement, fireEvent } from '@testing-library/react';
import assert from 'assert';

let snapshotData, web3;

beforeAll(async () => {
  snapshotData = await takeSnapshot();
});

afterAll(() => {
  restoreSnapshot(snapshotData);
});

const WithNoProxyOrAllowance = ({ children }) => {
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

  return changedAccount ? children : <div />;
};

test('ProxyAllowanceStepper flow', async () => {
  const { getAllByText, getByTestId, getByText, findByText } = renderWithMaker(
    <WithNoProxyOrAllowance>
      <ProxyAllowanceStepper
        token={'BAT'}
        title={'Add More BAT'}
        description={'Less Ads, more BAT'}
      >
        <div>{'You have set Proxy and Allowance for BAT'}</div>
      </ProxyAllowanceStepper>
    </WithNoProxyOrAllowance>
  );
  const { click } = fireEvent;

  await waitForElement(() => getByTestId('proxy-allowance-form'));

  getByText('Add More BAT');
  getByText('Step 1 of 2. Giving permissions');

  const proxyButton = getByText('Setup').closest('button');

  expect(proxyButton).toBeEnabled();
  expect(getByText('Set').closest('button')).toBeDisabled();

  click(proxyButton);

  await findByText('Waiting for confirmations... 0 of 10');
  await mineBlocks(web3, 15);

  const allowanceButton = getByText('Set').closest('button');
  expect(allowanceButton).toBeEnabled();
  click(allowanceButton);

  await wait(() => assert(getAllByText('checkmark.svg').length === 2));

  await findByText('Step 2 of 2. Less Ads, more BAT');
  await findByText('You have set Proxy and Allowance for BAT');
});
