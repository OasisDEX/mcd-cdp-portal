import React from 'react';
import { cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import { BAT, DAI, USD } from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';

import Generate from '../Generate';
import { renderWithMaker } from '../../../../test/helpers/render';
import lang from '../../../languages';
import useMaker from '../../../hooks/useMaker';
import { createCurrencyRatio } from '@makerdao/currency';

const ILK = 'BAT-A';
const DUST = '20.00';
const LIQUIDATION_RATIO = '2';
const COL_AMT = 300.123456789012345678;

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

const collateralAmount = BAT(COL_AMT);
const liquidationRatio = createCurrencyRatio(USD, DAI)(LIQUIDATION_RATIO);
const collateralValue = USD(72.03);

const mockVault = {
  id: 1,
  debtValue: DAI(0),
  daiAvailable: DAI(36.014814),
  vaultType: ILK,
  collateralAmount,
  liquidationRatio,
  debtFloor: BigNumber(DUST),
  collateralValue,
  calculateLiquidationPrice: ({ debtValue: _debtValue }) =>
    math.liquidationPrice(collateralAmount, _debtValue, liquidationRatio),
  calculateCollateralizationRatio: ({ debtValue: _debtValue }) =>
    math
      .collateralizationRatio(collateralValue, _debtValue)
      .times(100)
      .toNumber()
};

test('basic rendering', async () => {
  const { findByText } = renderWithMaker(<Generate vault={mockVault} />);

  await findByText(lang.action_sidebar.generate_title);
  await findByText(/USD\/BAT/);
});

test('input validation', async () => {
  const { getByText, getByRole, findByText } = renderWithMaker(
    <Generate vault={mockVault} />
  );

  await findByText(/USD\/BAT/);
  // await findByText(/BAT\/USD/);

  const input = getByRole('textbox');

  // shouldn't allow drawing too much dai
  // given price, liq ratio, ink, and art, drawing 37 dai should undercollateralize the cdp
  fireEvent.change(input, { target: { value: '37' } });
  const belowThresholdEl = getByText(lang.action_sidebar.cdp_below_threshold);
  // the message goes away when the input is corrected
  fireEvent.change(input, { target: { value: '36' } });
  expect(belowThresholdEl).not.toBeInTheDocument();

  // must be a number
  fireEvent.change(input, { target: { value: 'abc' } });
  expect(input.value).toBe('');

  // cdp must not be under dust limit
  fireEvent.change(input, { target: { value: '15' } });
  const underDustLimitEl = getByText(
    lang.formatString(lang.cdp_create.below_dust_limit, DUST)
  );
  fireEvent.change(input, { target: { value: '21' } });
  expect(underDustLimitEl).not.toBeInTheDocument();
});

test('verify info container values', async () => {
  const { getByText, findByText, getByRole } = renderWithMaker(
    <Generate vault={mockVault} />
  );

  // initial liquidation price
  await findByText(/0 USD\/BAT/);
  // await findByText(/0 BAT\/USD/);
  // dai available
  await findByText(/36.014814 DAI/);

  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: '21' } });

  // new liquidation price
  getByText(/0.1399 USD\/BAT/);
  // new simulated collat ratio
  getByText(/343.00%/);
  // dai available remains the same
  getByText(/36.014814 DAI/);
});

test('calls the draw function as expected', async () => {
  let maker;
  const { getByText, findByText, getByRole } = renderWithMaker(
    React.createElement(() => {
      maker = useMaker().maker;
      return <Generate vault={mockVault} reset={() => {}} />;
    })
  );

  await findByText(/USD\/BAT/);

  const DRAW_AMT = '21';
  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: DRAW_AMT } });

  const generateButton = getByText(lang.actions.generate);
  const mockDraw = jest.fn();
  maker.service('mcd:cdpManager').draw = mockDraw;
  act(() => {
    fireEvent.click(generateButton);
  });

  expect(mockDraw.mock.calls.length).toBe(1);
  // 1st arg should be the cdp id
  expect(mockDraw.mock.calls[0][0]).toBe(1);
  // next, the ilk
  expect(mockDraw.mock.calls[0][1]).toBe(ILK);
  // finally, the draw amount as a currency object
  expect(mockDraw.mock.calls[0][2]).toMatchObject(DAI(DRAW_AMT));
});
