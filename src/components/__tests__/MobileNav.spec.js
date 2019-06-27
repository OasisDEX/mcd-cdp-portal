import React from 'react';
// import { withRouter } from 'react-router';
import * as Navi from 'navi';
import { NaviProvider } from 'react-navi';
import { render, cleanup, waitForElement } from '@testing-library/react';

import MobileNav from '../MobileNav';
import sidebars from '../Sidebars';

import StoreProvider from '../../providers/StoreProvider';
import TestMakerProvider from '../../../test/helpers/TestMakerProvider';
import { SidebarProvider } from '../../providers/SidebarProvider';
import { ETH } from '@makerdao/dai';
import { mount, route } from 'navi';

//0xbeefed1bedded2dabbed3defaced4decade5dead

afterEach(cleanup);

const initialState = {
  system: {
    globalDebtCeiling: '100'
  },
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
  const navigation = Navi.createMemoryNavigation({
    routes: mount({ '/test': route() }),
    url: '/owner'
  });

  const { getByText } = render(
    <NaviProvider navigation={navigation}>
      <StoreProvider reducer={() => initialState} initialState={initialState}>
        <TestMakerProvider waitForAuth={true}>
          <SidebarProvider sidebars={sidebars}>
            <MobileNav />
          </SidebarProvider>
        </TestMakerProvider>
      </StoreProvider>
    </NaviProvider>
  );

  await waitForElement(() => getByText('ETH-A'));

  getByText('%');
});
