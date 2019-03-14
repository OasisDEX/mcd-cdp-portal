import React, { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { NavProvider, NavContent, NavNotFoundBoundary } from 'react-navi';
import { hot } from 'react-hot-loader/root';
import { GenericNotFound } from 'pages/NotFound';
import store from './store';
import theme from 'styles/theme';
import LoadingLayout from 'layouts/LoadingLayout';

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

function App() {
  return (
    <Body>
      <NavNotFoundBoundary render={GenericNotFound}>
        <Suspense fallback={<LoadingLayout text="Loading..." />}>
          <NavContent />
        </Suspense>
      </NavNotFoundBoundary>
    </Body>
  );
}

function AppWithContext({ navigation }) {
  return (
    <NavProvider navigation={navigation}>
      <ThemeProvider theme={theme}>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </ThemeProvider>
    </NavProvider>
  );
}

export default hot(AppWithContext);
