import React from 'react';
import { Box, Flex, Card } from '@makerdao/ui-components-core';
import { ReactComponent as CloseIcon } from 'images/close-simple.svg';

const SidebarActionLayout = ({ onClose, children }) => {
  return (
    <Card p="m">
      <Flex justifyContent="flex-end" pb="xs">
        <Box
          onClick={onClose}
          position="absolute"
          zIndex="2"
          css={{ cursor: 'pointer' }}
        >
          <CloseIcon />
        </Box>
      </Flex>
      {children}
    </Card>
  );
};
export default SidebarActionLayout;
