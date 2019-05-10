import React from 'react';
import { Box } from '@makerdao/ui-components-core';

const PageContentLayout = ({ children }) => (
  <Box p={{ s: '25px 12px', xl: '55px 32px' }}>
    <Box maxWidth="1200px" mx="auto">
      {children}
    </Box>
  </Box>
);

export default PageContentLayout;
