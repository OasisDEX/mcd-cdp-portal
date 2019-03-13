import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import Loader from 'components/Loader';

const LoadingLayout = ({
  text,
  size = 40,
  offsetTop = '30vh',
  background = '#fff'
}) => (
  <Box gridRowGap="l" p="m" maxWidth="100%" width="100vw" height="100vh">
    <h3
      css={{
        textAlign: 'center',
        marginTop: offsetTop
      }}
    >
      {text}
    </h3>
    <Box py="m">
      <Loader size={size} background={background} />
    </Box>
  </Box>
);

export default LoadingLayout;
