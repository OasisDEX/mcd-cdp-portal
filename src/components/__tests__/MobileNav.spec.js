import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';

import { NaviProvider } from 'react-navi';
import { mount, route, createMemoryNavigation } from 'navi';

import { ETH } from '@makerdao/dai';
import { ThemeProvider } from 'styled-components';
import theme from 'styles/theme';

import LanguageProvider from '../../providers/LanguageProvider';
import StoreProvider from '../../providers/StoreProvider';
import TestMakerProvider from '../../../test/helpers/TestMakerProvider';
import MobileNav from '../MobileNav';

afterEach(cleanup);

const cdpId = 1;

const initialState = {
  system: {
    globalDebtCeiling: '1000'
  }
};

test('MobileNav menu displays Earn, Borrow, and Trade buttons', async () => {
  const navigation = createMemoryNavigation({
    routes: mount({ '/test': route() }),
    url: `/${cdpId}`
  });
  const { getByText } = render(
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <NaviProvider navigation={navigation}>
          <StoreProvider
            reducer={() => initialState}
            initialState={initialState}
          >
            <TestMakerProvider waitForAuth={true}>
              <MobileNav cdpId={cdpId} />
            </TestMakerProvider>
          </StoreProvider>
        </NaviProvider>
      </ThemeProvider>
    </LanguageProvider>
  );

  await waitForElement(() => getByText('Earn'));
  await waitForElement(() => getByText('Borrow'));
  await waitForElement(() => getByText('Trade'));
});
