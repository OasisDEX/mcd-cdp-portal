import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import Payback from '../Payback';
import StoreProvider from '../../../providers/StoreProvider';
import TestMakerProvider from '../../../../test/helpers/TestMakerProvider';
import lang from '../../../languages';
import { ETH } from '@makerdao/dai';

afterEach(cleanup);

const initialState = {
  cdps: {
    '1': {
      ilk: 'ETH-A',
      ink: '2',
      art: '5',
      currency: {
        symbol: 'ETH'
      }
    }
  },
  feeds: [
    {
      key: 'ETH-A',
      price: ETH(100),
      rate: '1.5'
    }
  ]
};

test('basic rendering', async () => {
  const { getByText } = render(
    <StoreProvider reducer={() => initialState} initialState={initialState}>
      <TestMakerProvider waitForAuth={true}>
        <Payback cdpId="1" />
      </TestMakerProvider>
    </StoreProvider>
  );

  await waitForElement(() => getByText(lang.action_sidebar.payback_title));

  // these throw errors if they don't match anything
  getByText('Pay Back DAI');
  getByText('7.5 DAI'); // art * rate
});
