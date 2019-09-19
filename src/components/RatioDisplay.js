import React from 'react';
import { getColor } from 'styles/theme';
import { CDP_SAFETY_LEVELS } from 'utils/constants';
import { Text } from '@makerdao/ui-components-core';

const CDP_SAFETY_COLOR_PALETTE = {
  [CDP_SAFETY_LEVELS.DANGER]: getColor('red'),
  [CDP_SAFETY_LEVELS.NEUTRAL]: getColor('orange.500'),
  [CDP_SAFETY_LEVELS.SAFE]: getColor('teal.500')
};

function lookupCDPSafetyLevel(ratio, ilkLiqRatio) {
  ratio = parseFloat(ratio);
  ilkLiqRatio = parseFloat(ilkLiqRatio);

  const ratioDifference = ratio - ilkLiqRatio;
  if (ratioDifference < 10) return CDP_SAFETY_LEVELS.DANGER;
  if (ratioDifference < 50) return CDP_SAFETY_LEVELS.NEUTRAL;
  return CDP_SAFETY_LEVELS.SAFE;
}

export default function RatioDisplay({ ratio, ilkLiqRatio, active, ...props }) {
  if (!ratio || ratio === Infinity) return null;
  const safetyLevel = lookupCDPSafetyLevel(ratio, ilkLiqRatio);

  return (
    <Text
      color={active ? 'white' : CDP_SAFETY_COLOR_PALETTE[safetyLevel]}
      {...props}
    >
      {ratio}%
    </Text>
  );
}
