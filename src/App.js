import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { themeLight } from '@makerdao/ui-components';
import { NavProvider, NavContent, NavNotFoundBoundary } from 'react-navi';

import { GenericNotFound } from 'pages/NotFound';
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
            <NavNotFoundBoundary render={GenericNotFound}>
              <Suspense fallback={<div>Loading...</div>}>
                <NavContent />
              </Suspense>
            </NavNotFoundBoundary>
          </Body>
        </Provider>
      </NavProvider>
    </ThemeProvider>
  );
}

export default App;
