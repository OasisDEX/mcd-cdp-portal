import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import LanguageProvider from '../../src/providers/LanguageProvider';
import StoreProvider from '../../src/providers/StoreProvider';
import VaultsProvider from '../../src/providers/VaultsProvider';
import TestMakerProvider from './TestMakerProvider';
import theme from 'styles/theme';
import { ThemeProvider } from 'styled-components';
import rootReducer from '../../src/reducers';
import useMaker from '../../src/hooks/useMaker';
const defaultInitialState = rootReducer({}, {});

export const mocks = { navigation: { navigate: jest.fn() } };

export function renderWithMaker(
  children,
  updateInitialState,
  reducer,
  providerProps
) {
  const state = updateInitialState
    ? updateInitialState(defaultInitialState)
    : defaultInitialState;

  return renderWithStore(
    <TestMakerProvider {...providerProps} waitForAuth={true} mocks={mocks}>
      {children}
    </TestMakerProvider>,
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

function WaitForAccount({ children, callback }) {
  const { account } = useMaker();
  callback(account);
  return account ? children : null;
}

export async function renderWithAccount(children, ...args) {
  let account;
  const output = renderWithMaker(
    <WaitForAccount
      callback={a => {
        account = a;
      }}
    >
      {children}
    </WaitForAccount>,
    ...args
  );
  await waitForElement(() => account);
  return { ...output, account };
}

export function renderWithVaults(children, viewedAddress) {
  return renderWithMaker(
    <VaultsProvider viewedAddress={viewedAddress}>{children}</VaultsProvider>,
    null,
    null,
    {}
  );
}
