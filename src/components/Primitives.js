import React from 'react';
import styled from 'styled-components';

import { Box } from '@makerdao/ui-components-core';

const Block = styled(Box)`
  display: block;
`;

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
export { Block, Pill };
