import React from 'react';
import { Flex, Text } from '@makerdao/ui-components-core';

const Waiting = () => (
  <Flex
    width="100vw"
    height="100vh"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
  >
    <Text.h2 textAlign="center">Coming soon</Text.h2>
    <Text py="m" mx="m">
      You will be able to create Maker Vaults and secure your Dai into Oasis
      Save from 16:00 UTC today
    </Text>
  </Flex>
);

export default Waiting;
