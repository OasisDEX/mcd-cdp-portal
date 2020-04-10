import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import Notifications from 'components/Notifications';
import CookieNotice from 'components/CookieNotice';

const PageContentLayout = ({ enableNotifications = true, children }) => {
  return (
    <Box p={{ s: '25px 12px', l: '30px 32px' }}>
      <Box maxWidth="1200px" mx="auto">
        {enableNotifications && <Notifications />}
        {children}
        <CookieNotice />
      </Box>
    </Box>
  );
};

export default PageContentLayout;
