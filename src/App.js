import React, { Suspense, useEffect } from 'react';
import { StateInspector } from 'reinspect';
import StoreProvider from './providers/StoreProvider';
import styled, { ThemeProvider } from 'styled-components';
import { Router, NotFoundBoundary } from 'react-navi';
import { createBrowserNavigation } from 'navi';
import { hot } from 'react-hot-loader/root';
import { GenericNotFound } from 'pages/NotFound';
import theme from 'styles/theme';
import routes from './routes';
import { gaInit, mixpanelInit } from './utils/analytics';
import LoadingLayout from 'layouts/LoadingLayout';
import ErrorBoundary from './ErrorBoundary';
import rootReducer from 'reducers';

const Body = styled.div`
  display: flex;
  min-height: 100vh;
`;

const navigation = createBrowserNavigation({
  routes
});

function App() {
  useEffect(() => {
    const reactGa = gaInit(navigation);
    const mixpanel = mixpanelInit(navigation);
    navigation.subscribe(route => {
      if (route.type === 'ready') {
        console.debug(`[Mixpanel] Tracked: ${route.title}`);
        mixpanel.track('Pageview', { routeName: route.title });

        console.debug(`[GA] Tracked pageview: ${route.url.href}`);
        reactGa.pageview(route.url.href);
      }
    });
  }, []);

  return (
    <Body>
      <NotFoundBoundary render={GenericNotFound}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingLayout text="Loading..." />}>
            <Router navigation={navigation} />
          </Suspense>
        </ErrorBoundary>
      </NotFoundBoundary>
    </Body>
  );
}

function AppWithContext() {
  return (
    <ThemeProvider theme={theme}>
      <StateInspector name="App">
        <StoreProvider reducer={rootReducer}>
          <App />
        </StoreProvider>
      </StateInspector>
    </ThemeProvider>
  );
}

export default hot(AppWithContext);
