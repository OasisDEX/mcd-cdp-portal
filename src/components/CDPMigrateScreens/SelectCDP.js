import React from 'react';
import { Text, Grid, Card, Button } from '@makerdao/ui-components-core';

export default ({ dispatch }) => {
  return (
    <Grid maxWidth="912px" gridRowGap="m">
      <Text.h2 textAlign="center">Select CDP to Migrate</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        maxWidth="498px"
        m="0 auto"
      >
        Select a CDP and pay back the stability fee in DAI or MKR to migrate it
        to Multi-collateral Dai and the new CDP Portal.
      </Text.p>
      <Grid gridRowGap="m" mt="xs">
        <Grid
          p="l"
          pb="0"
          gridTemplateColumns="repeat(6, 1fr)"
          alignItems="center"
          fontWeight="medium"
          color="steelLight"
        >
          <span>CDP ID</span>
          <span>Current Ratio</span>
          <span>Dai Debt</span>
          <span>Stability Fee</span>
          <span>Stability Fee</span>
          <span />
        </Grid>
        <Card p="l">
          <Grid
            gridTemplateColumns="repeat(6, 1fr)"
            alignItems="center"
            fontWeight="bold"
          >
            <span>#3223</span>
            <span>168.50%</span>
            <span>425.72 DAI</span>
            <span>13.34 DAI</span>
            <span>0.23 MKR</span>
            <Button onClick={() => dispatch({ type: 'increment-step' })}>
              Migrate
            </Button>
          </Grid>
        </Card>
        <Card p="l">
          <Grid
            gridTemplateColumns="repeat(6, 1fr)"
            alignItems="center"
            fontWeight="bold"
          >
            <span>#3223</span>
            <span>168.50%</span>
            <span>425.72 DAI</span>
            <span>13.34 DAI</span>
            <span>0.23 MKR</span>
            <Button onClick={() => dispatch({ type: 'increment-step' })}>
              Migrate
            </Button>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
