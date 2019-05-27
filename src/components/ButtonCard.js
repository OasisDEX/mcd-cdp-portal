import React from 'react';
import { Card, Grid, Box, Text, Button } from '@makerdao/ui-components-core';

const ButtonCard = ({
  icon,
  title,
  subtitle,
  onClick,
  buttonText,
  ...props
}) => {
  return (
    <Card py="s" px="m" {...props}>
      <Grid
        alignItems="center"
        gridTemplateColumns="auto 1fr auto"
        gridRowGap="s"
        gridColumnGap="s"
      >
        {icon && (
          <Box pl="s" pr="m">
            {icon}
          </Box>
        )}
        <Box flexGrow="1">
          <h3>
            <Text fontSize="1.8rem" letterSpacing="-0.06rem">
              {title}
            </Text>
          </h3>
          <Box color="text" opacity="0.9">
            {subtitle}
          </Box>
        </Box>
        <Box gridColumn={'3'} alignSelf="center">
          <Button onClick={onClick}>{buttonText}</Button>
        </Box>
      </Grid>
    </Card>
  );
};

ButtonCard.defaultProps = {
  buttonText: 'Next'
};

export default ButtonCard;
