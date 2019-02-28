import React from 'react';
import { Flex } from '@makerdao/ui-components-core';
import { mediaQueries } from 'styles/constants';
const breakpoint = mediaQueries.m.min;

const LandingHeroLayout = ({ children }) => (
  <Flex
    alignItems="center"
    p="m"
    css={`
      flex-direction: column;
      justify-content: space-evenly;
      text-align: center;

      ${breakpoint} {
        flex-direction: row;
        text-align: left;
      }
    `}
  >
    {children}
  </Flex>
);

export default LandingHeroLayout;
