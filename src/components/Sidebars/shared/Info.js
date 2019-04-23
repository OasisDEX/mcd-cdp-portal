import React from 'react';
import { Text, Grid } from '@makerdao/ui-components-core';

const Info = ({ title, body, ...rest }) => {
  return (
    <Grid gridRowGap="2xs" key={title} py="s" {...rest}>
      <div>
        <Text t="subheading" color="darkLavender">
          {title}
        </Text>
      </div>
      <div>
        <Text color="text">{body}</Text>
      </div>
    </Grid>
  );
};

export default Info;
