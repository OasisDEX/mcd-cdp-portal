import React from 'react';
import styled from 'styled-components';
import { CDP_SAFETY_LEVELS } from 'utils/constants';
import { Text } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';

const StyledRatio = styled(Text)`
  color: ${({ color }) => color};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const CDP_SAFETY_COLOR_PALETE = {
  [CDP_SAFETY_LEVELS.DANGER]: '#f65728',
  [CDP_SAFETY_LEVELS.NEUTRAL]: '#c2c2c2',
  [CDP_SAFETY_LEVELS.SAFE]: '#24be9f'
};

function lookupCDPSafetyLevel(ratio) {
  ratio = parseFloat(ratio);
  if (ratio < 250) return CDP_SAFETY_LEVELS.DANGER;
  if (ratio < 500) return CDP_SAFETY_LEVELS.NEUTRAL;
  return CDP_SAFETY_LEVELS.SAFE;
}

export default function RatioDisplay({ ratio, active }) {
  if (!ratio) return null;
  const safetyLevel = lookupCDPSafetyLevel(ratio);

  return (
    <StyledRatio
      color={active ? 'white' : CDP_SAFETY_COLOR_PALETE[safetyLevel]}
    >
      {prettifyNumber(ratio, true)}%
    </StyledRatio>
  );
}
