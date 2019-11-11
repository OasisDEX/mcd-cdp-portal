import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import useBanner from '../hooks/useBanner';

const PageContentLayout = ({ children }) => {
  const { current, shouldShow } = useBanner();
  const { component: BannerContainer } = current;

  return (
    <Box p={{ s: '25px 12px', l: '55px 32px' }}>
      <Box maxWidth="1200px" mx="auto">
        {shouldShow && <BannerContainer />}
        {children}
      </Box>
    </Box>
  );
};

export default PageContentLayout;
