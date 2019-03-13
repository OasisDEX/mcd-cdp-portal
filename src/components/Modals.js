import React from 'react';
import CDPCreate from 'components/CDPCreate';
import { Grid } from '@makerdao/ui-components-core';

const modals = {
  cdpcreate: props => (
    <Grid gridRowGap="l" p="m" maxWidth="100%" width="95vw" height="90vh">
      <CDPCreate />
    </Grid>
  )
};

export default modals;
