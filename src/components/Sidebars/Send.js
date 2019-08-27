import React from 'react';
import {
  Text,
  Input,
  Grid,
  Link,
  Button,
  Box
} from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';

const Send = ({ token, reset }) => {
  return (
    <Box>
      <Text>SEND {token}</Text>
    </Box>
  );
};

export default Send;
