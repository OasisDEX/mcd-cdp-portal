import React, { useEffect, useState } from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Withdraw from '../Withdraw';
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
        ilk: 'BAT-A',
        ink: '10',
        art: '0',
        currency: {
          symbol: 'BAT'
        },
        rate: '1.5',
        liquidationRatio: '150'
      }
    }
  };
  newState.feeds.find(i => i.key === 'BAT-A').rate = '1.5';
  return newState;
};

test('basic rendering', async () => {
  const { getByText } = render(<Withdraw cdpId="1" />, setupMockState);

  // wait for CDP data to load
  await waitForElement(() => getByText(/10 BAT/));

  // these throw errors if they don't match anything
  getByText('Withdraw BAT');
  getByText('Set max');
});

let web3;

// const SetupProxyAndAllowance = () => {
//   const [changedAccount, setAccountChanged] = useState(false);
//   const { maker } = useMaker();
//   web3 = maker.service('web3');

//   useEffect(() => {
//     const changeAccount = async () => {
//       const accountService = maker.service('accounts');
//       TestAccountProvider.setIndex(345);
//       const { key } = TestAccountProvider.nextAccount();
//       await accountService.addAccount('noproxy', { type: 'privateKey', key });
//       accountService.useAccount('noproxy');
//       setAccountChanged(true);
//     };
//     changeAccount();
//   });

//   return changedAccount ? <Withdraw cdpId="1" /> : <div />;
// };

test('set-max', async () => {
  const { getByTestId } = render(<Withdraw cdpId="1" />, setupMockState);
  // const [setMax, allowanceToggle] = await Promise.all([
  //   waitForElement(() => getByTestId('set-max')),
  //   waitForElement(() => getByTestId('allowance-toggle'))
  // ]);

  const setMax = await waitForElement(() => getByTestId('set-max'));

  console.log('setMax', setMax.children);

  expect(setMax).toHaveTextContent('Set max');

  // const proxyButton = setMax.children[1];
  // const allowanceButton = allowanceToggle.children[1];
  // expect(proxyButton).toBeEnabled();
  // expect(allowanceButton).toBeDisabled();

  act(() => {
    fireEvent.click(setMax);
  });

  // TODO in progress: need to also grab the input element so we can
  // check the value after we click Set Max

  expect(setMax).toHaveTextContent(lang.action_sidebar.creating_proxy);
  // await mineBlocks(web3, 11);
  // expect(proxyToggle).toHaveTextContent(lang.action_sidebar.proxy_created);

  // expect(allowanceButton).toBeEnabled();
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
