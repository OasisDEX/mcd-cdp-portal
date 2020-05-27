import React from 'react';
import * as navi from 'react-navi';
import assert from 'assert';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {
  wait,
  fireEvent,
  waitForElement,
  cleanup
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DAI, ETH } from '@makerdao/dai-plugin-mcd';
import { createCurrency } from '@makerdao/currency';
import { TestAccountProvider, mineBlocks } from '@makerdao/test-helpers';
import Save from '../Save';
import {
  renderWithAccount,
  renderWithMaker,
  mocks,
  useMakerMock
} from '../../../test/helpers/render';
import { instantiateMaker } from '../../maker';
import { SidebarProvider } from '../../providers/SidebarProvider';
import SidebarBase from 'components/SidebarBase';
import { of } from 'rxjs';
import { ZERO_ADDRESS } from 'utils/constants';

const { click, change } = fireEvent;

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn()
}));

jest.mock('react-navi');
navi.useCurrentRoute.mockReturnValue({
  url: { search: '?network=testnet', pathname: '/test' }
});
navi.Link = styled.a``;

const AMOUNT = 80.1234567;
const ILK = 'ETH-A';
let maker;
let web3;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
  web3 = maker.service('web3');
  await await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(1), DAI(AMOUNT));
});

afterEach(cleanup);

test('if allowance is 0, show toggle & disable input', async () => {
  const { getAllByText, findByText, getByTestId, getByRole } = renderWithMaker(
    <SidebarProvider>
      <Save viewedAddress={maker.currentAddress()} />
      <SidebarBase />
    </SidebarProvider>
  );

  await findByText('Savings');
  click(getByTestId('sidebar-deposit-button'));
  await waitForElement(() => getAllByText('Unlock DAI to continue'));

  const depositInput = getByRole('textbox');
  expect(depositInput.disabled).toBe(true);
});

test('render save page and perform deposit and withdraw actions', async () => {
  const {
    getAllByText,
    getByTestId,
    getAllByTestId,
    getByText,
    getByRole,
    findByText
  } = await renderWithAccount(
    <SidebarProvider>
      <Save viewedAddress={maker.currentAddress()} />
      <SidebarBase />
    </SidebarProvider>
  );

  // Wait for page to render
  await waitForElement(() => getByText('Savings'));
  // Initial DSR balance
  getByText('DAI locked in DSR');
  // Savings to date
  getByText('Savings earned to date');
  // Dai Savings Rate
  await findByText('1.00%');
  // Privacy policy
  getByText('privacy policy');
  // CTA in history table when empty
  await wait(() =>
    getByText('Deposit Dai to see your first transaction and start earning')
  );

  /**Deposit */
  click(getByTestId('sidebar-deposit-button'));
  await findByText(/would you like to deposit/);

  // Unlock dai to continue
  await waitForElement(() => getByTestId('allowance-toggle'));
  const [allowanceToggle] = getAllByTestId('allowance-toggle');
  click(allowanceToggle.children[1]);
  await waitForElement(() => getByText('DAI unlocked'));

  // Input amount to deposit and click
  const depositInput = getByRole('textbox');
  change(depositInput, { target: { value: '21.123456789' } });
  click(getByTestId('deposit-button'));

  // Balance and history table update after deposit
  await wait(() => getByText('21.12345', { exact: false }));
  await wait(() => getByText(/Deposited/));

  /**Withdraw */
  click(getByTestId('sidebar-withdraw-button'));
  await findByText(/would you like to withdraw/);

  // wait for proxy and allowance check
  await mineBlocks(web3, 5);

  // Input amount to withdraw and click
  const withdrawInput = getByRole('textbox');
  change(withdrawInput, { target: { value: '7' } });
  click(getByTestId('withdraw-button'));

  // Balance and history table update after withdraw
  await wait(() => getByText('14.12345', { exact: false }));
  await wait(() => getByText(/Withdrew/));

  // Two entries in the history table
  await wait(() => assert(getAllByText('external-link.svg').length === 2));
}, 25000);

test('cannot deposit more than token allowance', async () => {
  // Setup mocks for multicall observables
  const MOCK_OBS_RESPONSE = () => of(BigNumber(Infinity));
  const TEST_ADDRESS_PROXY = '0x570074CCb147ea3dE2E23fB038D4d78324278886';

  const tokenBalanceMock = (address, tokens) => {
    return of(
      tokens.map(token => {
        if (token === 'DAI') return DAI(BigNumber(50));
        else return createCurrency(token)(0);
      })
    );
  };
  const savingsMock = () =>
    of({
      daiLockedInDsr: DAI('5000'),
      annualDaiSavingsRate: BigNumber(1),
      savingsDai: DAI('100'),
      savingsRateAccumulator: BigNumber(1)
    });
  const watch = () =>
    mocks.watch({
      savings: savingsMock,
      tokenBalances: tokenBalanceMock,
      tokenAllowance: () => of(BigNumber('10')),
      proxyAddress: () => of(TEST_ADDRESS_PROXY),
      daiLockedInDsr: () => of(DAI('100')),
      collateralTypesPrices: () => of([]),
      totalDaiSupply: MOCK_OBS_RESPONSE,
      vaultsCreated: MOCK_OBS_RESPONSE,
      totalDaiLockedInDsr: MOCK_OBS_RESPONSE,
      annualDaiSavingsRate: MOCK_OBS_RESPONSE,
      systemCollateralization: MOCK_OBS_RESPONSE,
      emergencyShutdownActive: () => of(false),
      emergencyShutdownTime: () => of(new Date(0))
    });

  const multicall = { watch };

  const { getByText, findByText, getByRole, getByTestId } = renderWithMaker(
    React.createElement(() => {
      useMakerMock({ multicall });
      return (
        <SidebarProvider>
          <Save viewedAddress={maker.currentAddress()} />
          <SidebarBase />
        </SidebarProvider>
      );
    })
  );

  await findByText('Savings');
  click(getByTestId('sidebar-deposit-button'));
  await findByText(/would you like to deposit/);

  const depositInput = getByRole('textbox');
  expect(depositInput.disabled).toBe(false);

  change(depositInput, { target: { value: '20' } });
  const warningEl = getByText('Amount is higher than your allowance for DAI');

  change(depositInput, { target: { value: '10' } });
  expect(warningEl).not.toBeInTheDocument();
});

test('display onboarding path if connected address has no proxy', async () => {
  const account = TestAccountProvider.nextAccount();
  const { findByText } = await renderWithMaker(
    React.createElement(() => {
      const { maker } = useMakerMock();
      const [flag, setFlag] = React.useState(false);
      React.useEffect(() => {
        const accountService = maker.service('accounts');
        accountService
          .addAccount('noproxy', {
            type: 'privateKey',
            key: account.key
          })
          .then(() => {
            accountService.useAccount('noproxy');
            setFlag(true);
          });
      }, []);

      return flag ? <Save viewedAddress={maker.currentAddress()} /> : <div />;
    })
  );

  await findByText(/Start earning/);
});

test('disable deposit/withdraw buttons if not connected wallet', async () => {
  const defaultAddress = maker.currentAddress();
  const account = TestAccountProvider.nextAccount();
  const { getByText } = await renderWithMaker(
    React.createElement(() => {
      const { maker } = useMakerMock();
      const [flag, setFlag] = React.useState(false);
      React.useEffect(() => {
        const accountService = maker.service('accounts');
        accountService
          .addAccount('noproxy', {
            type: 'privateKey',
            key: account.key
          })
          .then(() => {
            accountService.useAccount('noproxy');
            setFlag(true);
          });
      }, []);

      return flag ? <Save viewedAddress={defaultAddress} /> : <div />;
    })
  );

  const depositBtn = await waitForElement(() => getByText('Deposit'));
  const withdrawBtn = await waitForElement(() => getByText('Withdraw'));
  expect(depositBtn).toBeDisabled();
  expect(withdrawBtn).toBeDisabled();
});

test('should not display Save ui for addresses which have no proxy', async () => {
  const { findByText } = renderWithMaker(<Save viewedAddress={ZERO_ADDRESS} />);

  await findByText(
    "This address either doesn't exist or has no DSR account history"
  );
});
