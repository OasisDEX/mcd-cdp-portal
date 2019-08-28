import React from 'react';
import { Card, Text } from '@makerdao/ui-components-core';

export default function({ children, ...rest }) {
  return (
    <Card px="m" py="s" bg="white" maxWidth="30rem" {...children}>
      <Text.p t="caption" color="darkLavender" lineHeight="normal">
        {children}
      </Text.p>
    </Card>
  );
}
