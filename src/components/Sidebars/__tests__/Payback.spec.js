import React, { useEffect, useState } from 'react';
import {
  cleanup,
  waitForElement,
  waitForElementToBeRemoved,
  fireEvent
} from '@testing-library/react';
import Payback, { ProxyAndAllowanceCheck } from '../Payback';
import lang from '../../../languages';
import { callGanache } from '@makerdao/test-helpers';

import { renderForSidebar as render } from '../../../../test/helpers/render';
import useMaker from '../../../hooks/useMaker';

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = render(<Payback cdpId="1" />);

  // this waits for the initial proxy & allowance check to finish
  await waitForElement(() => getByText(/Unlock DAI/));

  // these throw errors if they don't match anything
  getByText('Pay Back DAI');
  getByText('7.5 DAI'); // art * rate
});

const SetupProxyAndAllowance = () => {
  const { maker, account, newTxListener } = useMaker();
  const [hasAllowance, setHasAllowance] = useState(false);
  return (
    <ProxyAndAllowanceCheck
      {...{ maker, account, newTxListener, hasAllowance, setHasAllowance }}
    />
  );
};

test('set allowance', async () => {
  const { getByTestId, findByText } = render(<SetupProxyAndAllowance />);
  await findByText(/Unlock/);

  const allowanceToggle = getByTestId('allowance-toggle');
  const allowanceButton = allowanceToggle.children[1];
  fireEvent.click(allowanceButton);
  await findByText(/Unlocking/);

  await callGanache('evm_mine');
  await callGanache('evm_mine');
  await findByText(/unlocked/);
});
