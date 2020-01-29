import React from 'react';
import { Grid, Text, Loader, Toggle } from '@makerdao/ui-components-core';
import { getColor } from 'styles/theme';

function LoadingToggle({
  defaultText,
  loadingText,
  completeText,
  isLoading,
  isComplete,
  onToggle,
  disabled,
  trackBtnClick,
  ...props
}) {
  const text = isLoading
    ? loadingText
    : isComplete
    ? completeText
    : defaultText;
  return (
    <Grid alignItems="center" gridTemplateColumns="auto 1fr auto" {...props}>
      <Text t="body">{text}</Text>
      {isLoading && (
        <Loader
          display="inline-block"
          size="1.8rem"
          color={getColor('spinner')}
          mr="xs"
          justifySelf="end"
        />
      )}
      <Toggle
        css={{ opacity: disabled ? 0.4 : 1 }}
        active={isComplete || isLoading}
        onClick={() => {
          if (trackBtnClick) trackBtnClick('Allowance');
          onToggle();
        }}
        justifySelf="end"
        disabled={disabled}
      />
    </Grid>
  );
}

export default LoadingToggle;
