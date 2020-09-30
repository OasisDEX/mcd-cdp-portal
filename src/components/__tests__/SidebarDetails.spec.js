import React from 'react';
import { SidebarProvider } from '../../providers/SidebarProvider';
import SidebarDetails from 'components/SidebarDetails';
import BigNumber from 'bignumber.js';
import { renderWithAccount } from '../../../test/helpers/render';

jest.mock('react-navi', () => ({
  useCurrentRoute: () => ({ url: { pathname: '/test' } })
}));

test('annual dai savings figure rounds half-up', async () => {
  const { findByText } = await renderWithAccount(
    <SidebarProvider>
      <SidebarDetails
        {...{ system: { annualDaiSavingsRate: BigNumber(0.999999) } }}
      />
    </SidebarProvider>
  );

  await findByText('1.00%');
});
