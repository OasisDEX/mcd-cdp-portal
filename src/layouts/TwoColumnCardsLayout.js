import React from 'react';
import { Grid, Card } from '@makerdao/ui-components-core';

const TwoColumnCardsLayout = ({ ratio = [4, 1], mainContent, sideContent }) => {
  const columnsTemplate = `${ratio[0]}fr ${ratio[1]}fr`;
  return (
    <Grid gridTemplateColumns={columnsTemplate} gridColumnGap="xs">
      <Card>{mainContent}</Card>
      <Card>{sideContent}</Card>
    </Grid>
  );
};

export default TwoColumnCardsLayout;
