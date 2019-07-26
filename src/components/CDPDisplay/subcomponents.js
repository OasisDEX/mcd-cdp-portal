import React from 'react';
import {
  Box,
  Grid,
  Flex,
  Card,
  Button,
  Text
} from '@makerdao/ui-components-core';
import styled from 'styled-components';

const WithSeparators = styled(Box).attrs(() => ({
  borderBottom: '1px solid',
  borderColor: 'grey.300'
}))`
  &:last-child {
    border-bottom: none;
  }
`;

export const InfoContainerRow = ({ title, value }) => {
  return (
    <WithSeparators>
      <Grid
        gridTemplateColumns="1fr auto"
        py="xs"
        gridColumnGap="s"
        alignItems="center"
      >
        <Text t="body">{title}</Text>
        <Text t="body">{value}</Text>
      </Grid>
    </WithSeparators>
  );
};

export const ActionContainerRow = ({ title, value, conversion, button }) => {
  return (
    <WithSeparators>
      <Grid
        py="s"
        gridTemplateColumns="1fr auto auto"
        alignItems="center"
        gridColumnGap="s"
        gridAutoRows="min-content"
        gridRowGap="2xs"
      >
        <Text
          css={`
            grid-column: 1;
            grid-row: span 2;
          `}
          t="body"
        >
          {title}
        </Text>
        <Text
          css={`
            grid-column: 2;
            grid-row: ${conversion ? '1' : 'span 2'};
          `}
          t="h5"
          color="darkLavender"
          justifySelf="end"
        >
          {value}
        </Text>
        {conversion ? (
          <ExtraInfo
            css={`
              grid-row: 2;
              grid-column: 2;
            `}
            justifySelf="end"
          >
            {conversion}
          </ExtraInfo>
        ) : null}
        <Box
          css={`
            grid-column: 3;
            grid-row: span 2;
          `}
        >
          {button}
        </Box>
      </Grid>
    </WithSeparators>
  );
};

export const ActionButton = ({ children, ...props }) => (
  <Button width="100px" p="xs" variant="secondary" {...props}>
    <Text fontSize="s" fontWeight="medium" color="darkLavender">
      {children}
    </Text>
  </Button>
);

export const CdpViewCard = ({ title, children }) => {
  return (
    <Flex py="s" height="100%" flexDirection="column">
      <Text.h4>{title}</Text.h4>
      <Card px={{ s: 'm', m: 'l' }} py="s" mt="s" flexGrow="1">
        {children}
      </Card>
    </Flex>
  );
};

export const AmountDisplay = ({ amount, denomination }) => {
  return (
    <>
      <Text t="h3" lineHeight="1">
        {amount}&nbsp;
      </Text>
      <Text t="h5">{denomination} &nbsp;</Text>
    </>
  );
};

export const ExtraInfo = ({ children, ...props }) => {
  return (
    <Text t="caption" lineHeight="none" color="steel" {...props}>
      {children}
    </Text>
  );
};
