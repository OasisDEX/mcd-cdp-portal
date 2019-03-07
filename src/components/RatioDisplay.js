import React from 'react';
import { getColor } from 'styles/theme';
import { CDP_SAFETY_LEVELS } from 'utils/constants';
import { Text } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';

const CDP_SAFETY_COLOR_PALETE = {
  [CDP_SAFETY_LEVELS.DANGER]: getColor('redVivid'),
  [CDP_SAFETY_LEVELS.NEUTRAL]: getColor('grayLight2'),
  [CDP_SAFETY_LEVELS.SAFE]: getColor('greenVivid')
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
