import React from 'react';
import { Button, Flex } from '@makerdao/ui-components-core';

const IconButton = ({ icon, children, ...props }) => {
  return (
    <Button variant="secondary-outline" width="225px" {...props}>
      <Flex alignItems="center">
        {icon}
        <span style={{ margin: 'auto' }}>{children}</span>
      </Flex>
    </Button>
  );
};

export default IconButton;
