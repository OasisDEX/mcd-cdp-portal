import React from 'react';
import { Text, Grid } from '@makerdao/ui-components-core';

const Info = ({ title, body }) => {
  return (
    <Grid gridRowGap="xs" key={title}>
      <div>
        <Text fontWeight="medium">{title}</Text>
      </div>
      <div>
        <Text color="text">{body}</Text>
      </div>
    </Grid>
  );
};

export default Info;
