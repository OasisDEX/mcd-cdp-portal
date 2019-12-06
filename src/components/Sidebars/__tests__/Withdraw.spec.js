import React from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Withdraw from '../Withdraw';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';
import { renderForSidebar as render } from '../../../../test/helpers/render';
import lang from '../../../languages';

let snapshotData;

beforeAll(async () => {
  snapshotData = await takeSnapshot();
});

afterAll(() => restoreSnapshot(snapshotData));

afterEach(cleanup);

const initialBat = '303.123456789012345678';
const setupMockState = state => {
  const newState = {
    ...state,
    cdps: {
      '1': {
        ilk: 'BAT-A',
        ink: initialBat,
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

  await waitForElement(() => getByText(/40 BAT\/USD/));

  getByText('Withdraw BAT');
});

test('clicking SetMax adds max collateral available to input', async () => {
  const { getByText, getByRole } = render(
    <Withdraw cdpId="1" />,
    setupMockState
  );

  // BAT amount is rounded correctly in UI
  await waitForElement(() => getByText(/303.123456 BAT/));

  const setMax = await waitForElement(() => getByText('Set max'));
  const input = getByRole('textbox');

  expect(input.value).toBe('');

  act(() => {
    fireEvent.click(setMax);
  });
  // input gets full amount of bat
  expect(input.value).toBe(initialBat);
}, 20000);

test('input validation', async () => {
  const { getByText, getByRole } = render(
    <Withdraw cdpId="1" />,
    setupMockState
  );
  await waitForElement(() => getByText(/303.123456 BAT/));
  const input = getByRole('textbox');

  // can't enter more collateral than available
  fireEvent.change(input, { target: { value: '500' } });
  await waitForElement(() => getByText(/Vault below liquidation threshold/));

  // must be greater than 0
  fireEvent.change(input, { target: { value: '0' } });
  await waitForElement(() => getByText(/Amount must be greater than 0/));

  // must be a number
  fireEvent.change(input, { target: { value: 'abc' } });
  expect(input.value).toBe('');
}, 20000);
