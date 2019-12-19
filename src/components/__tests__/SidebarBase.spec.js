import React from 'react';
import SidebarBase from '../SidebarBase';
import { SidebarProvider } from '../../providers/SidebarProvider';
import { renderWithAccount } from '../../../test/helpers/render';
import * as navi from 'react-navi';

jest.mock('react-navi');

test('basic rendering for Borrow', async () => {
  navi.useCurrentRoute.mockReturnValue({ url: { pathname: '/borrow' } });
  const { getByText } = await renderWithAccount(
    <SidebarProvider>
      <SidebarBase />
    </SidebarProvider>
  );
  getByText('Wallet Balances');
  getByText('Price Feeds');
});
