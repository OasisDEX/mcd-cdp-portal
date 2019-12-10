import React from 'react';
import { render } from '@testing-library/react';
import LanguageProvider from '../../src/providers/LanguageProvider';
import StoreProvider from '../../src/providers/StoreProvider';
import TestMakerProvider from './TestMakerProvider';
import theme from 'styles/theme';
import { ThemeProvider } from 'styled-components';
import rootReducer from '../../src/reducers';

const defaultInitialState = rootReducer({}, {});

export function renderForSidebar(children, updateInitialState, reducer) {
  const state = updateInitialState
    ? updateInitialState(defaultInitialState)
    : defaultInitialState;

  return renderWithStore(
    <TestMakerProvider waitForAuth={true}>{children}</TestMakerProvider>,
    state,
    reducer
  );
}

export function renderWithStore(children, initialState = {}, reducer = null) {
  return render(
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <StoreProvider
          reducer={reducer ? reducer : rootReducer}
          initialState={initialState}
        >
          {children}
        </StoreProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
