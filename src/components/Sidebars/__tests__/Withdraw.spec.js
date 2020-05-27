import React from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BAT, USD, DAI } from '@makerdao/dai-plugin-mcd';
import { fromWei } from '@makerdao/dai-plugin-mcd/dist/utils';
import { createCurrencyRatio } from '@makerdao/currency';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';

import Withdraw from '../Withdraw';
import { renderWithMaker } from '../../../../test/helpers/render';
import lang from '../../../languages';
import useMaker from '../../../hooks/useMaker';

const ILK = 'BAT-A';
const INITIAL_BAT = '300.123456789012345678';
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

const liquidationRatio = createCurrencyRatio(USD, DAI)(LIQUIDATION_RATIO);
const collateralValue = USD(12004.938271560493);
const debtValue = DAI(0);

const mockVault = {
  id: 1,
  collateralType: ILK,
  debtValue,
  encumberedDebt: fromWei(0),
  daiAvailable: DAI(36.014814),
  vaultType: ILK,
  collateralAmount: BAT(0), // used to retrieve gem symbol
  encumberedCollateral: fromWei(1000000000000000000),
  liquidationRatio,
  collateralValue,
  collateralAvailableAmount: BAT(INITIAL_BAT),
  collateralTypePrice: createCurrencyRatio(USD, BAT)(40.0),
  calculateLiquidationPrice: ({ collateralAmount: _collateralAmount }) =>
    math.liquidationPrice(_collateralAmount, debtValue, liquidationRatio),
  calculateCollateralizationRatio: ({ collateralValue: _collateralValue }) =>
    math
      .collateralizationRatio(_collateralValue, debtValue)
      .times(100)
      .toNumber()
};

test('basic rendering', async () => {
  const { getByText } = renderWithMaker(<Withdraw vault={mockVault} />);

  await waitForElement(() => getByText(/40.00 USD\/BAT/));

  getByText('Withdraw BAT');
});

test('clicking SetMax adds max collateral available to input', async () => {
  const { getByText, getByRole } = renderWithMaker(
    <Withdraw vault={mockVault} />
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
  const { getByText, getByRole } = renderWithMaker(
    <Withdraw vault={mockVault} />
  );
  await waitForElement(() => getByText(/300.123456 BAT/));
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
});

test('calls the wipeAndFree function as expected', async () => {
  let maker;
  const { getByText, findByText, getByRole } = renderWithMaker(
    React.createElement(() => {
      maker = useMaker().maker;
      return <Withdraw vault={mockVault} reset={() => {}} />;
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
  expect(mockWipeAndFree.mock.calls[0][2]).toMatchObject(DAI(0));
  // finally, the amount to free as a currency object
  expect(mockWipeAndFree.mock.calls[0][3]).toMatchObject(BAT(WD_AMT));
});
