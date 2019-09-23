import React from 'react';
import { render } from '@testing-library/react';
import LanguageProvider from '../../src/providers/LanguageProvider';
import StoreProvider from '../../src/providers/StoreProvider';
import TestMakerProvider from './TestMakerProvider';
import { ETH } from '@makerdao/dai';
import theme from 'styles/theme';
import { ThemeProvider } from 'styled-components';
import rootReducer from '../../src/reducers';

export function renderForSidebar(children, initialState) {
  if (!initialState) {
    initialState = {
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
  }

  return renderWithStore(
    <TestMakerProvider waitForAuth={true}>{children}</TestMakerProvider>,
    initialState
  );
}

export function renderWithStore(children, initialState = {}) {
  return render(
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <StoreProvider reducer={rootReducer} initialState={initialState}>
          {children}
        </StoreProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
