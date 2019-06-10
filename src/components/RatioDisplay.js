import React from 'react';
import { getColor } from 'styles/theme';
import { CDP_SAFETY_LEVELS } from 'utils/constants';
import { Text } from '@makerdao/ui-components-core';

const CDP_SAFETY_COLOR_PALETTE = {
  [CDP_SAFETY_LEVELS.DANGER]: getColor('orange.500'),
  [CDP_SAFETY_LEVELS.NEUTRAL]: getColor('grey.300'),
  [CDP_SAFETY_LEVELS.SAFE]: getColor('teal.500'),
  neutral_inverse: getColor('steel')
};

function lookupCDPSafetyLevel(ratio, inverse) {
  ratio = parseFloat(ratio);
  if (ratio < 250) return CDP_SAFETY_LEVELS.DANGER;
  if (ratio < 500)
    return inverse ? 'neutral_inverse' : CDP_SAFETY_LEVELS.NEUTRAL;
  return CDP_SAFETY_LEVELS.SAFE;
}

export default function RatioDisplay({ ratio, active, inverse, t }) {
  if (!ratio || ratio === Infinity) return null;
  const safetyLevel = lookupCDPSafetyLevel(ratio, inverse);

  return (
    <Text
      t={t ? t : 'p6'}
      color={active ? 'white' : CDP_SAFETY_COLOR_PALETTE[safetyLevel]}
    >
      {ratio}%
    </Text>
  );
}
