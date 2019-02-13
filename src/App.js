import React, { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { themeLight } from '@makerdao/ui-components';
import { NavProvider, NavContent, NavNotFoundBoundary } from 'react-navi';

import { GenericNotFound } from 'pages/NotFound';

import store from './store';

const theme = {
  ...themeLight,
  header: {
    linkHeaderColor: '#291A41',
    backgroundColor: '#F6F8F9',
    linkColor: '#627685'
  }
};

const Body = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
  max-height: 100vh;
`;

function App() {
  return (
    <Body>
      <NavNotFoundBoundary render={GenericNotFound}>
        <Suspense fallback={<div>Loading...</div>}>
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

export default AppWithContext;
