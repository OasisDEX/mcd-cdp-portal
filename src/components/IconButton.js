import React from 'react';
import { Button, Flex, Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';

const IconBox = styled(Box)`
  & > svg {
    display: inline-block;
  }
  width: 26px;
  text-align: center;
`;

const IconButton = ({ icon, children, ...props }) => {
  return (
    <Button variant="secondary-outline" width="225px" {...props}>
      <Flex alignItems="center">
        <IconBox>{icon}</IconBox>
        <span style={{ margin: 'auto' }}>{children}</span>
      </Flex>
    </Button>
  );
};

export default IconButton;
