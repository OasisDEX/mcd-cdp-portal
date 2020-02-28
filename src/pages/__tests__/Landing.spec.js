import React from 'react';
import Landing from '../Landing';
import { renderWithProviders } from '../../../test/helpers/render';
import * as navi from 'react-navi';
jest.mock('react-navi');

test('basic rendering', () => {
  navi.useCurrentRoute.mockReturnValue({ url: { search: '' } });
  const { getByText } = renderWithProviders(<Landing />);
  getByText(/Trade, Borrow, and Save using Dai./);
  getByText(/Maker Ecosystem Growth Holdings/);
});
