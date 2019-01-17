import React from 'react';
import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { themeLight, Grid } from '@makerdao/ui-components';
import { NavProvider, NavContent, NavNotFoundBoundary } from 'react-navi';

import { GenericNotFound } from 'pages/NotFound';
import Navbar from './components/Navbar';

import cdpTypesConfig from './references/cdpTypes';
import store from './store';

const Body = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
`;

function App(props) {
  return (
    <ThemeProvider theme={themeLight}>
      <NavProvider navigation={props.navigation}>
        <Provider store={store}>
          <Body>
            <Grid
              gridTemplateColumns="80px 1fr 315px"
              gridTemplateAreas="'navbar view sidebar'"
            >
              <Navbar cdps={cdpTypesConfig} />
              <NavNotFoundBoundary render={GenericNotFound}>
                <NavContent />
              </NavNotFoundBoundary>
            </Grid>
          </Body>
        </Provider>
      </NavProvider>
    </ThemeProvider>
  );
}

export default App;
