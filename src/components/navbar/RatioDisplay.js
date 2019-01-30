import React from 'react';
import styled from 'styled-components';
import { CDP_SAFETY_LEVELS } from 'utils/constants';
import { Text } from '@makerdao/ui-components';

const StyledRatio = styled(Text)`
  color: ${({ theme, color }) => theme.colors[color]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const CDP_SAFETY_COLOR_PALETE = {
  [CDP_SAFETY_LEVELS.DANGER]: 'makerOrange',
  [CDP_SAFETY_LEVELS.WARNING]: 'daiYellow',
  [CDP_SAFETY_LEVELS.SAFE]: 'backgroundGrey'
};

function lookupCDPSafetyLevel(_ratio, cdpType) {
  const ratio = parseFloat(_ratio);
  if (ratio < 250) return CDP_SAFETY_LEVELS.DANGER;
  if (ratio < 500) return CDP_SAFETY_LEVELS.WARNING;
  return CDP_SAFETY_LEVELS.SAFE;
}

export default function RatioDisplay({ ratio, cdpType }) {
  if (!ratio) return null;
  const safetyLevel = lookupCDPSafetyLevel(ratio, cdpType);

  return (
    <StyledRatio color={CDP_SAFETY_COLOR_PALETE[safetyLevel]}>
      {ratio}%
    </StyledRatio>
  );
}
