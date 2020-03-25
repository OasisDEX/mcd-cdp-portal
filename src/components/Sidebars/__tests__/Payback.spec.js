import React from 'react';
import {
  cleanup,
  waitForElement,
  fireEvent,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BAT, USD, MDAI } from '@makerdao/dai-plugin-mcd';
import { createCurrencyRatio } from '@makerdao/currency';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import BigNumber from 'bignumber.js';
import Payback from '../Payback';
import {
  renderWithMaker,
  mocks,
  useMakerMock
} from '../../../../test/helpers/render';
import lang from '../../../languages';
import { of } from 'rxjs';
import {
  TestAccountProvider,
  takeSnapshot,
  restoreSnapshot
} from '@makerdao/test-helpers';
import { createCurrency } from '@makerdao/currency';

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

jest.mock('react-navi', () => ({
  useCurrentRoute: () => ({ url: { pathname: '/test' } })
}));

afterEach(cleanup);

const ILK = 'ETH-A';
const LIQUIDATION_RATIO = '200';
const COL_AMT = 300.123456789012345678;

const collateralAmount = BAT(0); //only used to retrieve gem symbol
const liquidationRatio = createCurrencyRatio(USD, MDAI)(LIQUIDATION_RATIO);
const collateralValue = USD(12004.938271560493);

const mockVault = {
  id: 1,
  collateralType: ILK,
  debtValue: MDAI(200),
  debtFloor: MDAI(0),
  daiAvailable: MDAI(36.014814),
  vaultType: ILK,
  collateralAmount,
  liquidationRatio,
  collateralValue,
  ownerAddress: '0x570074CCb147ea3dE2E23fB038D4d78324278886',
  collateralAvailableAmount: BAT(COL_AMT),
  collateralTypePrice: createCurrencyRatio(USD, BAT)(40.0),
  calculateLiquidationPrice: ({ debtValue: _debtValue }) =>
    math.liquidationPrice(collateralAmount, _debtValue, liquidationRatio),
  calculateCollateralizationRatio: ({ debtValue: _debtValue }) =>
    math
      .collateralizationRatio(collateralValue, _debtValue)
      .times(100)
      .toNumber()
};
const TEST_ADDRESS_PROXY = '0x570074CCb147ea3dE2E23fB038D4d78324278886';

const proxyAddress = () => of(TEST_ADDRESS_PROXY);
const tokenAllowance = () => of(BigNumber(Infinity));
const daiLockedInDsr = () => of(MDAI(0));
const tokenBalances = (address, tokens) => {
  return of(
    tokens.map(token => {
      if (token === 'MDAI') return MDAI('100.123451');
      else return createCurrency(token)(0);
    })
  );
};

const watch = (overrides = {}) =>
  mocks.watch({
    proxyAddress,
    tokenAllowance,
    tokenBalances,
    daiLockedInDsr,
    ...overrides
  });

const multicall = { watch };

let snapshotData, account;

beforeAll(async () => {
  snapshotData = await takeSnapshot();
  console.error = jest.fn();
  TestAccountProvider.setIndex(345);
  account = TestAccountProvider.nextAccount();
});

afterAll(() => {
  restoreSnapshot(snapshotData);
});

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = renderWithMaker(<Payback vault={mockVault} />);

  await waitForElement(() => getByText(/Pay Back DAI/));
});

test('input validation', async () => {
  const { getByText, getByRole, findByText } = renderWithMaker(
    React.createElement(() => {
      useMakerMock({ multicall });
      return <Payback vault={mockVault} />;
    })
  );

  // Balance rounded correctly
  await findByText('100.123451 DAI');

  const input = getByRole('textbox');
  // can't deposit more DAI than there is in the connected wallet
  fireEvent.change(input, { target: { value: '200' } });
  const errString = lang.formatString(
    lang.action_sidebar.insufficient_balance,
    'DAI'
  );
  await getByText(errString);
});

test('calls the wipe function as expected', async () => {
  const mockWipe = jest.fn();
  const { getByText, findByText, getByRole } = renderWithMaker(
    React.createElement(() => {
      useMakerMock({
        multicall,
        'mcd:cdpManager': { wipe: () => mockWipe }
      });

      return <Payback vault={mockVault} reset={() => {}} />;
    })
  );

  // Balance rounded correctly
  await findByText('100.123451 DAI');

  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: '100' } });

  const paybackButton = getByText(lang.actions.pay_back);
  expect(paybackButton).toBeEnabled();
  act(() => {
    fireEvent.click(paybackButton);
  });

  expect(mockWipe.mock.calls.length).toBe(1);
  expect(mockWipe.mock.calls[0][0]).toBe(1);
  expect(mockWipe.mock.calls[0][1]).toMatchObject(MDAI('100'));
  expect(mockWipe.mock.calls[0][2]).toBe(mockVault.ownerAddress);
});
