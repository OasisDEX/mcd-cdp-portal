import React from 'react';
import { Box } from '@makerdao/ui-components-core';

const Pill = ({ bg, children, ...props }) => {
  return (
    <Box
      bg={bg}
      p="1px"
      px="xs"
      borderRadius="500px"
      css={`
        display: inline-block;
      `}
      {...props}
    >
      {children}
    </Box>
  );
};
export { Pill };
