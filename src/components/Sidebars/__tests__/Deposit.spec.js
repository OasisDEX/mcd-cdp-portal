import React from 'react';
import { fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BAT, USD, DAI } from '@makerdao/dai-plugin-mcd';
import { fromWei } from '@makerdao/dai-plugin-mcd/dist/utils';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import { createCurrency, createCurrencyRatio } from '@makerdao/currency';
import {
  TestAccountProvider,
  takeSnapshot,
  restoreSnapshot
} from '@makerdao/test-helpers';
import BigNumber from 'bignumber.js';

import Deposit from '../Deposit';
import {
  renderWithMaker,
  mocks,
  useMakerMock
} from '../../../../test/helpers/render';
import lang from '../../../languages';
import { formatter } from 'utils/ui';
import { of } from 'rxjs';

let snapshotData;
let account;

const originalConsoleError = console.error;
jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

jest.mock('react-navi', () => ({
  useCurrentRoute: () => ({ url: { pathname: '/test' } })
}));

beforeAll(async () => {
  snapshotData = await takeSnapshot();
  console.error = jest.fn();
  TestAccountProvider.setIndex(345);
  account = TestAccountProvider.nextAccount();
});

afterAll(() => {
  console.error = originalConsoleError;
  restoreSnapshot(snapshotData);
});

const ILK = 'BAT-A';
const INITIAL_BAT = '300.123456789012345678';
const PRICE = createCurrencyRatio(USD, BAT)('0.2424');
const BAT_ACCOUNT_BALANCE = '200.123451234512345123';
const DSR_AMT = '100';
const TEST_ADDRESS_PROXY = '0x570074CCb147ea3dE2E23fB038D4d78324278886';

const liquidationRatio = createCurrencyRatio(USD, DAI)('2');
const collateralValue = USD(74.852);
const debtValue = DAI(26);

// The vault observable gets passed in as a prop, so we have to mock it here
const mockVault = {
  id: 1,
  debtValue,
  vaultType: ILK,
  collateralAmount: BAT(INITIAL_BAT),
  encumberedCollateral: fromWei(300123456789012345678),
  liquidationRatio,
  collateralValue,
  collateralTypePrice: PRICE,
  calculateLiquidationPrice: ({ collateralAmount: _collateralAmount }) =>
    math.liquidationPrice(_collateralAmount, debtValue, liquidationRatio),
  calculateCollateralizationRatio: ({ collateralValue: _collateralValue }) =>
    math
      .collateralizationRatio(_collateralValue, debtValue)
      .times(100)
      .toNumber()
};

// Define mock observable schemas
const proxyAddress = () => of(TEST_ADDRESS_PROXY);
const tokenAllowance = () => of(BigNumber(Infinity));
const daiLockedInDsr = () => of(DAI(DSR_AMT));
const tokenBalances = (address, tokens) => {
  return of(
    tokens.map(token => {
      if (token === 'BAT') return BAT(BAT_ACCOUNT_BALANCE);
      else return createCurrency(token)(0);
    })
  );
};

// Allows for override of mocked schemas for individual tests
const watch = (overrides = {}) =>
  mocks.watch({
    tokenBalances,
    proxyAddress,
    tokenAllowance,
    daiLockedInDsr,
    ...overrides
  });

const multicall = { watch };

test('basic rendering', async () => {
  const { findByText, findAllByText } = renderWithMaker(
    <Deposit vault={mockVault} />
  );

  await findByText(
    lang.formatString(lang.action_sidebar.deposit_title, BAT.symbol)
  );
  await findAllByText(/BAT\/USD/);
});

test('input validation', async () => {
  const { getByText, findByText, findAllByTestId } = renderWithMaker(
    React.createElement(() => {
      const { maker } = useMakerMock({ multicall });

      React.useEffect(() => {
        const accountService = maker.service('accounts');
        accountService
          .addAccount('noproxy', {
            type: 'privateKey',
            key: account.key
          })
          .then(() => accountService.useAccount('noproxy'));
      }, []);

      return <Deposit vault={mockVault} />;
    })
  );

  // Balance rounded correctly
  await findByText('200.123451 BAT');

  const input = (await findAllByTestId('deposit-input'))[2];

  // can't deposit more BAT than there is in the connected wallet
  fireEvent.change(input, { target: { value: '201' } });
  const balanceTooLowEl = getByText(
    lang.formatString(lang.action_sidebar.insufficient_balance, BAT.symbol)
  );
  // the message goes away when the input is corrected
  fireEvent.change(input, { target: { value: '200' } });
  expect(balanceTooLowEl).not.toBeInTheDocument();
});

test('verify info container values', async () => {
  const { getByText, findByText, findAllByTestId } = renderWithMaker(
    React.createElement(() => {
      const { maker } = useMakerMock({ multicall });
      React.useEffect(() => {
        const accountService = maker.service('accounts');
        accountService
          .addAccount('noproxy', {
            type: 'privateKey',
            key: account.key
          })
          .then(() => accountService.useAccount('noproxy'));
      }, []);

      return <Deposit vault={mockVault} />;
    })
  );

  // Balance rounded correctly
  await findByText('200.123451 BAT');
  // BAT/USD price
  await findByText(`${formatter(PRICE)} USD/BAT`, {
    exact: true
  });
  // initial liquidation price
  await findByText(/0.1732 USD\/BAT/);
  // initial collat ratio
  await findByText(/287.89%/);
  const input = (await findAllByTestId('deposit-input'))[2];
  fireEvent.change(input, { target: { value: BAT_ACCOUNT_BALANCE } });

  // new liquidation price
  getByText(/0.1039 USD\/BAT/);
  // new simulated collat ratio
  getByText(/474.47%/);
  // BAT available remains the same
  await findByText('200.123451 BAT');
  // BAT/USD price remains the same
  await findByText(`${formatter(PRICE)} USD/BAT`, { exact: true });
});

test('calls the lock function as expected', async () => {
  let maker;
  const mockLock = jest.fn();
  const { getByText, findByText, findAllByTestId } = renderWithMaker(
    React.createElement(() => {
      maker = useMakerMock({
        multicall,
        'mcd:cdpManager': { lock: () => mockLock }
      }).maker;

      React.useEffect(() => {
        const accountService = maker.service('accounts');
        accountService
          .addAccount('noproxy', {
            type: 'privateKey',
            key: account.key
          })
          .then(() => accountService.useAccount('noproxy'));
      }, []);

      return <Deposit vault={mockVault} reset={() => {}} />;
    })
  );

  // Balance rounded correctly
  await findByText('200.123451 BAT');
  const input = (await findAllByTestId('deposit-input'))[2];
  fireEvent.change(input, { target: { value: BAT_ACCOUNT_BALANCE } });

  const depositButton = getByText(lang.actions.deposit);
  act(() => {
    fireEvent.click(depositButton);
  });

  expect(mockLock.mock.calls.length).toBe(1);
  // 1st arg should be the cdp id
  expect(mockLock.mock.calls[0][0]).toBe(1);
  // next, the ilk
  expect(mockLock.mock.calls[0][1]).toBe(ILK);
  // finally, the lock amount as a currency object
  expect(mockLock.mock.calls[0][2]).toMatchObject(BAT(BAT_ACCOUNT_BALANCE));
});
