import React from 'react';
import { Grid, Card } from '@makerdao/ui-components-core';

const TwoColumnCardsLayout = ({
  ratio = [4, 1],
  mainContent,
  sideContent,
  SidebarComponent = Card
}) => {
  const columnsTemplate = `${ratio[0]}fr ${ratio[1]}fr`;
  return (
    <Grid gridTemplateColumns={columnsTemplate} gridColumnGap="m">
      <Card>{mainContent}</Card>
      <SidebarComponent>{sideContent}</SidebarComponent>
    </Grid>
  );
};

export default TwoColumnCardsLayout;
