import React from 'react';
import lang from 'languages';
import { Text, Grid, Card, Button } from '@makerdao/ui-components-core';

export default ({ dispatch }) => {
  return (
    <Grid maxWidth="912px" gridRowGap="m">
      <Text.h2 textAlign="center">{lang.cdp_migrate.select_title}</Text.h2>
      <Text.p
        textAlign="center"
        t="body"
        fontSize="1.8rem"
        maxWidth="498px"
        m="0 auto"
      >
        {lang.cdp_migrate.select_text}
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
          <span>{lang.cdp_id}</span>
          <span>{lang.cdp_migrate.current_ratio}</span>
          <span>{lang.cdp_migrate.dai_debt}</span>
          <span>{lang.stability_fee} (DAI)</span>
          <span>{lang.stability_fee} (MKR)</span>
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
              {lang.cdp_migrate.migrate}
            </Button>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
