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
          You will be able to create Maker Vaults and secure your Dai into Oasis
          Save from 16:00 UTC today
        </Text>
      </Flex>
    </div>
  </Flex>
);

export default Waiting;
