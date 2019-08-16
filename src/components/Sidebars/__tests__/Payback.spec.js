import React, { useEffect, useState } from 'react';
import { cleanup, waitForElement } from '@testing-library/react';
import Payback, { ProxyAndAllowanceCheck } from '../Payback';
import lang from '../../../languages';
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
  const [hasAllowance, setAllowance] = useState(false);

  return (
    <ProxyAndAllowanceCheck
      {...{ maker, account, newTxListener, hasAllowance, setAllowance }}
    />
  );
};

test('Proxy + Allowance check', async () => {
  const { getByText } = render(<SetupProxyAndAllowance />);
  await waitForElement(() => getByText(lang.action_sidebar.create_proxy));
});
