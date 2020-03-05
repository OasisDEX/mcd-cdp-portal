import React from 'react';
import { Text, Grid } from '@makerdao/ui-components-core';
import TextMono from 'components/TextMono';

const Info = ({ title, body, ...rest }) => {
  return (
    <Grid gridRowGap="2xs" key={title} py="s" {...rest}>
      <div>
        <Text t="subheading" color="darkLavender">
          {title}
        </Text>
      </div>
      <div>
        <TextMono color="text">{body}</TextMono>
      </div>
    </Grid>
  );
};

export default Info;
