import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import LanguageProvider from '../../src/providers/LanguageProvider';
import VaultsProvider from '../../src/providers/VaultsProvider';
import NotificationProvider from '../../src/providers/NotificationProvider';
import TransactionManagerProvider from '../../src/providers/TransactionManagerProvider';
import TestMakerProvider from './TestMakerProvider';
import theme from 'styles/theme';
import { ThemeProvider } from 'styled-components';
import useMaker from '../../src/hooks/useMaker';

export const mocks = {
  navigation: { navigate: jest.fn() },
  // Provide multicall schemas to mock. They must return an observable.
  watch: schemas => (key, ...args) => schemas[key] && schemas[key](...args)
};

export const useMakerMock = (mockServices = {}) => {
  /** Provide an object of maker services & methods you want to mock, eg:
        multicall: {
          watch: () => jest.fn()
        }
  */
  const { maker } = useMaker();
  Object.entries(mockServices).map(([name, methods]) =>
    Object.entries(methods).map(
      ([method, mockFn]) => (maker.service(name)[method] = mockFn())
    )
  );
  return { maker };
};

export function renderWithMaker(children, providerProps) {
  return renderWithProviders(
    <TestMakerProvider {...providerProps} waitForAuth={true} mocks={mocks}>
      {children}
    </TestMakerProvider>
  );
}

export function renderWithProviders(children) {
  return render(
    <NotificationProvider>
      <LanguageProvider>
        <TransactionManagerProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </TransactionManagerProvider>
      </LanguageProvider>
    </NotificationProvider>
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
    {}
  );
}
