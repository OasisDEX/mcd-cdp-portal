import React from 'react';
import { Box, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as CloseIcon } from 'images/close-simple.svg';

const Generate = ({ onClose, children }) => {
  return (
    <Box p="m">
      <Flex justifyContent="flex-end" pb="m">
        <Box onClick={onClose} css={{ cursor: 'pointer' }}>
          <CloseIcon />
        </Box>
      </Flex>
      {children}
    </Box>
  );
};
export default Generate;
