import React from 'react';
import lang from 'languages';
import { Button, Text, Flex } from '@makerdao/ui-components-core';

export default function AccountConnect() {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text t="p5">{lang.sidebar.read_only_mode}</Text>
      <Button
        ml="auto"
        px="s"
        py="xs"
        height="auto"
        variant="secondary-outline"
      >
        {lang.connect}
      </Button>
    </Flex>
  );
}
