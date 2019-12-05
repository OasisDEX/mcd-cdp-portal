import React from 'react';
import { Loader, Text, Flex } from '@makerdao/ui-components-core';
import { getColor } from 'styles/theme';

const LoadingLayout = ({ text, size = '4rem', background = '#fff' }) => (
  <Flex
    gridRowGap="l"
    p="m"
    maxWidth="100%"
    width="100vw"
    height="100vh"
    alignItems="center"
    justifyContent="center"
  >
    <div>
      <Text.h3 textAlign="center">{text}</Text.h3>
      <Flex py="m" justifyContent="center">
        <Loader size={size} color={getColor('spinner')} bg={background} />
      </Flex>
    </div>
  </Flex>
);

export default LoadingLayout;
