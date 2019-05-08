import React from 'react';
import { Flex } from '@makerdao/ui-components-core';

const LandingHeroLayout = ({ children }) => (
  <Flex
    alignItems="center"
    p="m"
    flexDirection={{ s: 'column', l: 'row' }}
    justifyContent="space-evenly"
    textAlign={{ s: 'center', l: 'left' }}
  >
    {children}
  </Flex>
);

export default LandingHeroLayout;
