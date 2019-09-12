import React, { useEffect, useState } from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { renderForSidebar as render } from '../../../../test/helpers/render';
import Send from '../Send';
import lang from 'languages';
import BigNumber from 'bignumber.js';
import { mineBlocks } from '@makerdao/test-helpers';
import { TestAccountProvider } from '../../../../node_modules/@makerdao/test-helpers/dist/TestAccountProvider';
import testAccounts from '../../../../node_modules/@makerdao/test-helpers/dist/testAccounts.json';
import useMaker from '../../../hooks/useMaker';

afterEach(cleanup);

test('basic rendering when sending ETH', async () => {
  const token = 'ETH';
  const { getByText } = render(<Send token={token} />);

  await waitForElement(() =>
    getByText(lang.formatString(lang.action_sidebar.send_title, token))
  );
  getByText(lang.formatString(lang.action_sidebar.send_description, token));
});

test('basic rendering when sending DAI', async () => {
  const token = 'MDAI';
  let getByText;
  act(() => {
    const { getByText: _getByText } = render(<Send token={token} />);
    getByText = _getByText;
  });

  await waitForElement(() =>
    getByText(lang.formatString(lang.action_sidebar.send_title, 'DAI'))
  );
  getByText(lang.formatString(lang.action_sidebar.send_description, 'DAI'));
});

test('basic rendering when sending WETH', async () => {
  const token = 'MWETH';
  let getByText;
  act(() => {
    const { getByText: _getByText } = render(<Send token={token} />);
    getByText = _getByText;
  });

  await waitForElement(() =>
    getByText(lang.formatString(lang.action_sidebar.send_title, 'WETH'))
  );
  getByText(lang.formatString(lang.action_sidebar.send_description, 'WETH'));
});

let _maker;

const getTokenBalance = (addr, token) =>
  _maker
    .service('token')
    .getToken(token)
    .balanceOf(addr);

const SetupSend = ({ token }) => {
  const { maker } = useMaker();
  _maker = maker;
  return <Send token={token} />;
};

// this test is also affected by multicall not updating eth balances in time
xtest('should send 1 ETH successfully', async () => {
  const { getByTestId, getAllByTestId } = render(<SetupSend token="ETH" />);
  const {
    addresses: [addr1, addr2]
  } = testAccounts;

  const [amountElements, addressElements, sendButton] = await Promise.all([
    waitForElement(() => getAllByTestId('send-amount-input')),
    waitForElement(() => getAllByTestId('send-address-input')),
    waitForElement(() => getByTestId('send-button'))
  ]);

  const [beforeBal1, beforeBal2] = await Promise.all([
    getTokenBalance(addr1, 'ETH'),
    getTokenBalance(addr2, 'ETH')
  ]);

  const amountInput = amountElements[2];
  const addressInput = addressElements[2];
  act(() => {
    fireEvent.change(amountInput, { target: { value: '1' } });
    fireEvent.change(addressInput, { target: { value: addr2 } });
  });

  expect(amountInput.value).toBe('1');
  expect(addressInput.value).toBe(addr2);

  act(() => {
    fireEvent.click(sendButton);
  });

  await mineBlocks(_maker.service('web3'));

  const [afterBal1, afterBal2] = await Promise.all([
    getTokenBalance(addr1, 'ETH'),
    getTokenBalance(addr2, 'ETH')
  ]);

  expect(afterBal1.minus(beforeBal1).toString()).toEqual('-1.00 ETH');
  expect(afterBal2.minus(beforeBal2).toString()).toEqual('1.00 ETH');
});
