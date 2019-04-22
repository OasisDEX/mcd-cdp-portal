import React from 'react';
import { Grid } from '@makerdao/ui-components-core';
import { colors } from '@makerdao/design-system-constants';

export default ({ children }) => (
  <Grid
    bg="coolGrey.100"
    px="m"
    py="s"
    borderRadius="default"
    css={`
      & > div:not(:last-child) {
        border-bottom: 1px solid ${colors.grey['300']};
      }
    `}
  >
    {children}
  </Grid>
);
