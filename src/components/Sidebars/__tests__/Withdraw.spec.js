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

  await waitForElement(() => getByText(/10 BAT/));

  getByText('Withdraw BAT');
});

test('clicking SetMax adds max collateral available to input', async () => {
  const { getByText } = render(<Withdraw cdpId="1" />, setupMockState);

  await waitForElement(() => getByText(/10 BAT/));

  const setMax = await waitForElement(() => getByText('Set max'));
  const input = getByText((text, el) => el.nodeName === 'INPUT');

  expect(input.value).toBe('');
  expect(setMax).toHaveTextContent(lang.set_max);

  act(() => {
    fireEvent.click(setMax);
  });

  expect(setMax).toHaveTextContent(lang.set_max);
  expect(input.value).toBe('10');
}, 20000);
