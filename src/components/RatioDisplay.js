import React from 'react';
import { useColor } from 'styles/theme';
import { CDP_SAFETY_LEVELS } from 'utils/constants';
import { Text } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';

const CDP_SAFETY_COLOR_PALETE = {
  [CDP_SAFETY_LEVELS.DANGER]: useColor('redVivid'),
  [CDP_SAFETY_LEVELS.NEUTRAL]: useColor('grayLight2'),
  [CDP_SAFETY_LEVELS.SAFE]: useColor('greenVivid')
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
    <Text
      t="p6"
      color={active ? 'white' : CDP_SAFETY_COLOR_PALETE[safetyLevel]}
    >
      {prettifyNumber(ratio, true)}%
    </Text>
  );
}
