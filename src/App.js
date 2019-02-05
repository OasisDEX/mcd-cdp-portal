import React, { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { themeLight, Grid } from '@makerdao/ui-components';
import {
  NavProvider,
  NavContent,
  NavRoute,
  NavNotFoundBoundary
} from 'react-navi';

import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import ErrorBoundary from 'components/ErrorBoundary';
import MakerAuthProvider from 'components/context/MakerAuth';
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

const View = styled.div`
  padding: 55px 32px;
  background: ${({ theme }) => theme.colors.backgroundGrey};
`;

function App() {
  return (
    <Body>
      <ErrorBoundary>
        <NavNotFoundBoundary render={GenericNotFound}>
          <NavRoute>
            {({ url }) => {
              if (url.pathname === '/') return <NavContent />;
              else
                return (
                  <Suspense fallback={<div>Loading...</div>}>
                    <Grid
                      gridTemplateColumns="80px 1fr 315px"
                      gridTemplateAreas="'navbar view sidebar'"
                      width="100%"
                    >
                      <Navbar />
                      <View>
                        <NavContent />
                      </View>
                      <Sidebar
                        network={{ name: 'kovan', ID: 42, swappable: false }}
                        address={url.query.address}
                        networkName="kovan"
                        networkDisplayName="Kovan Testnet"
                      />
                    </Grid>
                  </Suspense>
                );
            }}
          </NavRoute>
        </NavNotFoundBoundary>
      </ErrorBoundary>
    </Body>
  );
}

function AppWithContext({ navigation }) {
  return (
    <NavProvider navigation={navigation}>
      <ThemeProvider theme={theme}>
        <ReduxProvider store={store}>
          <MakerAuthProvider>
            <App />
          </MakerAuthProvider>
        </ReduxProvider>
      </ThemeProvider>
    </NavProvider>
  );
}

export default AppWithContext;
