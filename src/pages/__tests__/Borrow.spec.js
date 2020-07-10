import React from 'react';
import Borrow from '../Borrow';
import { renderWithMaker } from '../../../test/helpers/render';
import { waitForElement } from '@testing-library/react';
import useAnalytics from 'hooks/useAnalytics';

jest.mock('hooks/useAnalytics');
useAnalytics.mockReturnValue(jest.fn());

test('Borrow calculator renders', async () => {
  const { getByTestId } = await renderWithMaker(
    <Borrow disableConnect={true} />,
    {
      waitForAuth: false
    }
  );

  const amountChosenElem = await waitForElement(() =>
    getByTestId('amount-chosen')
  );

  // 25 ETH is the default amount in the Borrow calculator
  expect(amountChosenElem.innerHTML.includes('25')).toBeTruthy();
});
