import React from 'react';
import { cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createCurrencyRatio } from '@makerdao/currency';
import { BAT, USD, MDAI } from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';

import Generate from '../Generate';
import { renderWithMaker as render } from '../../../../test/helpers/render';
import lang from '../../../languages';
import useMaker from '../../../hooks/useMaker';

const ILK = 'BAT-A';
const INITIAL_BAT = '300.123456789012345678';
const INITIAL_ART = '0';

const PAR = new BigNumber('1000000000000000000000000000');

const DEBT_CEILING = '1000';
const RATE = '1.000967514019988230';
const DUST = '20';
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
        dust: DUST,
        rate: RATE,
        feedValueUSD: PRICE,
        debtCeiling: DEBT_CEILING,
        liquidationRatio: LIQUIDATION_RATIO
      }
    ],
    system: {
      par: PAR
    }
  };
  return newState;
};

// so that dispatched actions don't affect the mocked state
const identityReducer = x => x;
const renderWithMockedStore = component =>
  render(component, setupMockState, identityReducer);

test('basic rendering', async () => {
  const { findByText } = renderWithMockedStore(<Generate cdpId={1} />);

  await findByText(lang.action_sidebar.generate_title);
  await findByText(/BAT\/USD/);
});

test('input validation', async () => {
  const { getByText, getByRole, findByText } = renderWithMockedStore(
    <Generate cdpId={1} />
  );

  await findByText(/BAT\/USD/);

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
  const { getByText, findByText, getByRole } = renderWithMockedStore(
    <Generate cdpId={1} />
  );

  // initial liquidation price
  await findByText(/0 BAT\/USD/);
  // dai available
  await findByText(/36.014814 DAI/);

  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: '21' } });

  // new liquidation price
  getByText(/0.14 BAT\/USD/);
  // new simulated collat ratio
  getByText(/343.00%/);
  // dai available remains the same
  getByText(/36.014814 DAI/);
});

test('calls the draw function as expected', async () => {
  let maker;
  const { getByText, findByText, getByRole } = renderWithMockedStore(
    React.createElement(() => {
      maker = useMaker().maker;
      return <Generate cdpId={1} reset={() => {}} />;
    })
  );

  await findByText(/BAT\/USD/);

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
  expect(mockDraw.mock.calls[0][2]).toMatchObject(MDAI(DRAW_AMT));
});
