import React from 'react';
import lang from 'languages';
import {
  Text,
  Grid,
  Card,
  Button,
  Radio,
  Overflow
} from '@makerdao/ui-components-core';

const RADIO_WIDTH = '2rem';
const RADIO_CONTAINER_WIDTH = '4rem';
const AESTHETIC_ROW_PADDING = '4rem';

export default ({ dispatch, onClose }) => {
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
      <Overflow x="scroll" y="visible">
        <Grid gridRowGap="m" mt="xs" pb="m">
          <Grid
            p="l"
            pb="0"
            gridTemplateColumns={`${RADIO_CONTAINER_WIDTH} repeat(5, 1fr) ${AESTHETIC_ROW_PADDING}`}
            gridColumnGap="m"
            alignItems="center"
            fontWeight="medium"
            color="steelLight"
            css={`
              white-space: nowrap;
            `}
          >
            <span />
            <Text t="subheading">{lang.cdp_id}</Text>
            <Text t="subheading">{lang.cdp_migrate.current_ratio}</Text>
            <Text t="subheading">{lang.cdp_migrate.dai_debt}</Text>
            <Text t="subheading">{lang.cdp_migrate.fee_in_dai}</Text>
            <Text t="subheading">{lang.cdp_migrate.fee_in_mkr}</Text>
          </Grid>
          <Card px="l" py="m">
            <Grid
              gridTemplateColumns={`${RADIO_CONTAINER_WIDTH} repeat(5, 1fr) ${AESTHETIC_ROW_PADDING}`}
              gridColumnGap="m"
              alignItems="center"
              fontSize="m"
              color="darkPurple"
              css={`
                white-space: nowrap;
              `}
            >
              <Radio fontSize={RADIO_WIDTH} />
              <span>#3223</span>
              <span>168.50%</span>
              <span>425.72 DAI</span>
              <span>13.34 DAI</span>
              <span>0.23 MKR</span>
            </Grid>
          </Card>
          <Card px="l" py="m">
            <Grid
              gridTemplateColumns={`${RADIO_CONTAINER_WIDTH} repeat(5, 1fr) ${AESTHETIC_ROW_PADDING}`}
              gridColumnGap="m"
              alignItems="center"
              fontSize="m"
              color="darkPurple"
              css={`
                white-space: nowrap;
              `}
            >
              <Radio fontSize={RADIO_WIDTH} />
              <span>#3223</span>
              <span>168.50%</span>
              <span>425.72 DAI</span>
              <span>13.34 DAI</span>
              <span>0.23 MKR</span>
            </Grid>
          </Card>
        </Grid>
      </Overflow>
      <Grid
        justifySelf="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onClose}>
          {lang.cancel}
        </Button>
        <Button onClick={() => dispatch({ type: 'increment-step' })}>
          {lang.cdp_migrate.migrate}
        </Button>
      </Grid>
    </Grid>
  );
};
