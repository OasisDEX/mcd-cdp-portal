import React from 'react';
import SaveOverview from '../SaveOverview';
import { renderWithMaker, mocks } from '../../../test/helpers/render';
import { fireEvent } from '@testing-library/react';
import { Routes } from 'utils/constants';
import useAnalytics from 'hooks/useAnalytics';

jest.mock('hooks/useAnalytics');
useAnalytics.mockReturnValue(jest.fn());

test('Save overview flow and re-route', async () => {
  const { findAllByText } = await renderWithMaker(<SaveOverview />, {
    waitForAuth: false
  });

  const connectWalletBtn = (await findAllByText('Active Wallet'))[0];
  fireEvent.click(connectWalletBtn);

  expect(mocks.navigation.navigate.mock.calls[0][0]).toEqual(
    `/${Routes.SAVE}/owner/0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6?network=testnet`
  );
});
