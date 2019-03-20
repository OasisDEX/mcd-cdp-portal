import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';

const ScreenHeader = ({ title, text }) => {
  return (
    <Box textAlign="center" pt="m">
      <Box pb="m">
        <TextBlock t="headingL" fontWeight="medium">
          {title}
        </TextBlock>
      </Box>
      <TextBlock t="textL" color="gray2">
        {text}
      </TextBlock>
    </Box>
  );
};

export default ScreenHeader;
