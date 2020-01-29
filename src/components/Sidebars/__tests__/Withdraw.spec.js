import React from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BAT, USD, MDAI } from '@makerdao/dai-plugin-mcd';
import { fromWei } from '@makerdao/dai-plugin-mcd/dist/utils';
import { createCurrencyRatio } from '@makerdao/currency';

import Withdraw from '../Withdraw';
import { renderWithMaker as render } from '../../../../test/helpers/render';
import lang from '../../../languages';
import useMaker from '../../../hooks/useMaker';
import BigNumber from 'bignumber.js';

const ILK = 'BAT-A';
const COL_AMT = 300.123456789012345678;
// TODO: BigNumber seems to truncate at 13 decimals,
// setting the config override doesn't seem to have an effect.
// const INITIAL_BAT = '300.123456789012345678';
const INITIAL_BAT = '300.1234567890123';

const INITIAL_ART = '0';

const RATE = '1.000967514019988230';
const PRICE = createCurrencyRatio(USD, BAT)('0.24');
const LIQUIDATION_RATIO = '200';

const originalConsoleError = console.error;
jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

jest.mock('react-navi', () => ({
  useCurrentRoute: () => ({ url: { pathname: '/test' } })
}));

beforeAll(async () => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

afterEach(cleanup);

const setupMockState = state => {
  const newState = {
    ...state,
    cdps: {
      1: {
        ilk: ILK,
        ink: INITIAL_BAT,
        art: INITIAL_ART
      }
    },
    feeds: [
      {
        key: ILK,
        currency: BAT,
        rate: RATE,
        feedValueUSD: PRICE,
        liquidationRatio: LIQUIDATION_RATIO
      }
    ]
  };
  return newState;
};

// so that dispatched actions don't affect the mocked state
const identityReducer = x => x;
const renderWithMockedStore = component =>
  render(component, setupMockState, identityReducer);

BigNumber.set({ DECIMAL_PLACES: 50 });

const mockVault = {
  collateralType: ILK,
  debtValue: MDAI(0),
  encumberedDebt: fromWei(0),
  daiAvailable: MDAI(36.014814),
  vaultType: ILK,
  collateralAmount: BAT(0), //only used to retrieve gem symbol
  encumberedCollateral: fromWei(1000000000000000000),
  liquidationRatioSimple: createCurrencyRatio(USD, MDAI)(LIQUIDATION_RATIO),
  collateralValue: USD(12004.938271560493),
  collateralAvailableAmount: BAT(COL_AMT),
  collateralTypePrice: createCurrencyRatio(USD, BAT)(40.0)
};

test('basic rendering', async () => {
  const { getByText } = render(
    <Withdraw cdpId="1" vault={mockVault} />,
    setupMockState
  );

  await waitForElement(() => getByText(/40.00 USD\/BAT/));

  getByText('Withdraw BAT');
});

test('clicking SetMax adds max collateral available to input', async () => {
  const { getByText, getByRole } = render(
    <Withdraw cdpId="1" vault={mockVault} />,
    setupMockState
  );

  // BAT amount is rounded correctly in UI
  await waitForElement(() => getByText(/300.123456 BAT/));

  const setMax = await waitForElement(() => getByText('Set max'));
  const input = getByRole('textbox');

  expect(input.value).toBe('');

  act(() => {
    fireEvent.click(setMax);
  });
  // input gets full amount of bat
  expect(input.value).toBe(INITIAL_BAT);
});

test('input validation', async () => {
  const { getByText, getByRole } = render(
    <Withdraw cdpId="1" vault={mockVault} />,
    setupMockState
  );
  await waitForElement(() => getByText(/300.123456 BAT/));
  const input = getByRole('textbox');

  //TODO fix 'amount cannot be negative' error in Withdraw
  // can't enter more collateral than available
  // fireEvent.change(input, { target: { value: '500' } });
  // await waitForElement(() => getByText(/Vault below liquidation threshold/));

  // must be greater than 0
  fireEvent.change(input, { target: { value: '0' } });
  await waitForElement(() => getByText(/Amount must be greater than 0/));

  // must be a number
  fireEvent.change(input, { target: { value: 'abc' } });
  expect(input.value).toBe('');
});

test('calls the wipeAndFree function as expected', async () => {
  let maker;
  const { getByText, findByText, getByRole } = renderWithMockedStore(
    React.createElement(() => {
      maker = useMaker().maker;
      return <Withdraw cdpId={1} vault={mockVault} reset={() => {}} />;
    })
  );

  await findByText(/BAT\/USD Price feed/);

  const WD_AMT = '100';
  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: WD_AMT } });

  const withdrawButton = getByText(lang.actions.withdraw);
  const mockWipeAndFree = jest.fn();
  maker.service('mcd:cdpManager').wipeAndFree = mockWipeAndFree;
  act(() => {
    fireEvent.click(withdrawButton);
  });

  expect(mockWipeAndFree.mock.calls.length).toBe(1);
  // 1st arg should be the cdp id
  expect(mockWipeAndFree.mock.calls[0][0]).toBe(1);
  // next, the ilk
  expect(mockWipeAndFree.mock.calls[0][1]).toBe(ILK);
  // next, the amount to wipe
  expect(mockWipeAndFree.mock.calls[0][2]).toMatchObject(MDAI(0));
  // finally, the amount to free as a currency object
  expect(mockWipeAndFree.mock.calls[0][3]).toMatchObject(BAT(WD_AMT));
});
