import React from 'react';
import { Box } from '@makerdao/ui-components-core';

export default function({ children }) {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        return (
          <Box bg={index % 2 === 0 ? 'coolGrey.100' : 'white'}>{child}</Box>
        );
      })}
    </>
  );
}
