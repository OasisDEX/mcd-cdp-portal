import React, { Suspense, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { Router, NotFoundBoundary } from 'react-navi';
import { createBrowserNavigation } from 'navi';
import { hot } from 'react-hot-loader/root';
import { GenericNotFound } from 'pages/NotFound';
import store from './store';
import theme from 'styles/theme';
import pages from './pages';
import { gaInit, mixpanelInit } from './utils/analytics';
import LoadingLayout from 'layouts/LoadingLayout';
import ErrorBoundary from './ErrorBoundary';

const NOT_PRODUCTION_READY_MODAL_SCROLLING = false;

const Body = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  ${NOT_PRODUCTION_READY_MODAL_SCROLLING
    ? `  div {
    overflow-y: auto;
  }`
    : ''}
`;

const navigation = createBrowserNavigation({
  routes: pages
});

function App() {
  useEffect(() => {
    gaInit(navigation);
    mixpanelInit(navigation);
  }, []);

  return (
    <Body>
      <ErrorBoundary>
        <NotFoundBoundary render={GenericNotFound}>
          <Suspense fallback={<LoadingLayout text="Loading..." />}>
            <Router navigation={navigation} />
          </Suspense>
        </NotFoundBoundary>
      </ErrorBoundary>
    </Body>
  );
}

function AppWithContext({ navigation }) {
  return (
    <ThemeProvider theme={theme}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ThemeProvider>
  );
}

export default hot(AppWithContext);
