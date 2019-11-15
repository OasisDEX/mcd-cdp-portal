import React from 'react';
import { Flex, Text } from '@makerdao/ui-components-core';

const Waiting = () => (
  <Flex
    maxWidth="100%"
    width="100vw"
    height="100vh"
    alignItems="center"
    justifyContent="center"
  >
    <div>
      <Text.h2 textAlign="center">Coming soon</Text.h2>
      <Flex py="m" justifyContent="center">
        <Text>
          All Sai and CDP Single-Collateral migrations and upgrades will be
          available on Monday 4:00PM UTC
        </Text>
      </Flex>
    </div>
  </Flex>
);

export default Waiting;
