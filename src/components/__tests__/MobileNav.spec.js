import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { NaviProvider } from 'react-navi';
import { mount, route, createMemoryNavigation } from 'navi';

import { ThemeProvider } from 'styled-components';
import theme from 'styles/theme';
import { mocks } from '../../../test/helpers/render';
import LanguageProvider from '../../providers/LanguageProvider';
import TestMakerProvider from '../../../test/helpers/TestMakerProvider';
import MobileNav from '../MobileNav';

const cdpId = 1;

test('MobileNav menu displays Save, Borrow, and Trade buttons', async () => {
  const navigation = createMemoryNavigation({
    routes: mount({ '/test': route() }),
    url: `/${cdpId}`
  });
  const { getByText } = render(
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <NaviProvider navigation={navigation}>
          <TestMakerProvider waitForAuth={true} mocks={mocks}>
            <MobileNav cdpId={cdpId} />
          </TestMakerProvider>
        </NaviProvider>
      </ThemeProvider>
    </LanguageProvider>
  );

  await waitFor(() => getByText('Save'));
  await waitFor(() => getByText('Borrow'));
  await waitFor(() => getByText('Trade'));
});
