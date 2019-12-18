import React from 'react';
import * as navi from 'react-navi';
import { waitForElement, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MDAI, ETH } from '@makerdao/dai-plugin-mcd';
import Overview from '../Overview';
import { renderWithAccount } from '../../../test/helpers/render';
import { instantiateMaker } from '../../maker';
import styled from 'styled-components';

jest.mock('react-navi');

const ILK = 'ETH-A';
const VAULT1_ETH = '6';
const VAULT1_ART = '80.1234567';
const VAULT2_ETH = '1';
const VAULT2_ART = '25';
const VIEWED_ADDRESS = '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6';

let maker;

beforeAll(async () => {
  maker = await instantiateMaker({ network: 'testnet' });
  await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(VAULT1_ETH), MDAI(VAULT1_ART));

  await maker
    .service('mcd:cdpManager')
    .openLockAndDraw(ILK, ETH(VAULT2_ETH), MDAI(VAULT2_ART));
});

function prepState(state) {
  return {
    ...state,
    cdps: {
      1: {
        ilk: ILK,
        ink: VAULT1_ETH,
        art: VAULT1_ART
      },
      2: {
        ilk: ILK,
        ink: VAULT2_ETH,
        art: VAULT2_ART
      }
    }
  };
}

afterEach(cleanup);

test('render overview page and display calculated vault values', async () => {
  navi.useCurrentRoute.mockReturnValue({ url: { search: '?network=testnet' } });
  navi.Link = styled.a``;
  const { getByText, getAllByText } = await renderWithAccount(
    <Overview viewedAddress={VIEWED_ADDRESS} />,
    prepState,
    null,
    { viewedAddress: VIEWED_ADDRESS }
  );

  await waitForElement(() => getByText('Overview'));

  // Total collateral locked
  getByText('$1050.00 USD');
  // Total Dai debt
  getByText(/105.\d{1,2} DAI/);
  // Vault1 Dai debt
  getByText(/80.2\d DAI/);
  // Current ratio
  getByText(/1121.\d{1,2}%/);
  // Deposited
  getByText('6.00 ETH');
  // Available to withdraw
  getByText('5.20 ETH');
  // Privacy policy
  getByText('privacy policy');

  // Manage vault buttons link to correct vault
  const [vault2, vault1] = getAllByText('Manage Vault');
  expect(vault1.closest('a')).toHaveAttribute(
    'href',
    '/borrow/1?network=testnet'
  );
  expect(vault2.closest('a')).toHaveAttribute(
    'href',
    '/borrow/2?network=testnet'
  );
}, 15000);
