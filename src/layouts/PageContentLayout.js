import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import Notifications from 'components/Notifications';
const PageContentLayout = ({ children }) => {
  return (
    <Box p={{ s: '25px 12px', l: '55px 32px' }}>
      <Box maxWidth="1200px" mx="auto">
        <Notifications />
        {children}
      </Box>
    </Box>
  );
};

export default PageContentLayout;
