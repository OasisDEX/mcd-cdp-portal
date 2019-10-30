import React, { useEffect, useState } from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Payback from '../Payback';
import {
  TestAccountProvider,
  takeSnapshot,
  restoreSnapshot,
  mineBlocks
} from '@makerdao/test-helpers';
import { renderForSidebar as render } from '../../../../test/helpers/render';
import useMaker from '../../../hooks/useMaker';
import lang from '../../../languages';

let snapshotData;

beforeAll(async () => {
  snapshotData = await takeSnapshot();
});

afterAll(() => restoreSnapshot(snapshotData));

afterEach(cleanup);

const setupMockState = state => {
  const newState = {
    ...state,
    cdps: {
      '1': {
        ilk: 'ETH-A',
        ink: '2',
        art: '5',
        currency: {
          symbol: 'ETH'
        }
      }
    }
  };
  newState.feeds.find(i => i.key === 'ETH-A').rate = '1.5';
  return newState;
};

test('basic rendering', async () => {
  const { getByText } = render(<Payback cdpId="1" />, setupMockState);

  // this waits for the initial proxy & allowance check to finish
  await waitForElement(() => getByText(/Unlock DAI/));

  // these throw errors if they don't match anything
  getByText('Pay Back DAI');
  getByText('7.5 DAI'); // art * rate from mock state
});

let web3;

const SetupProxyAndAllowance = () => {
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

  return changedAccount ? <Payback cdpId="1" /> : <div />;
};

test('proxy toggle', async () => {
  const { getByTestId } = render(<SetupProxyAndAllowance />, setupMockState);
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
  await mineBlocks(web3, 11);
  expect(proxyToggle).toHaveTextContent(lang.action_sidebar.proxy_created);

  expect(allowanceButton).toBeEnabled();
}, 20000);

// commented out for now because this doesn't seem to work well with allowances
// from multicall
xtest('allowance toggle', async () => {
  const { getByTestId, queryByTestId } = render(
    <SetupProxyAndAllowance />,
    setupMockState
  );

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
  await mineBlocks(web3);
  expect(allowanceToggle).toHaveTextContent(
    lang.formatString(lang.action_sidebar.token_unlocked, 'DAI')
  );
});
