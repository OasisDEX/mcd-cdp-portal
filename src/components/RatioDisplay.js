import React from 'react';
import { getSafetyLevels } from 'styles/theme';
import { SAFETY_LEVELS } from 'utils/constants';
import { Text, Card } from '@makerdao/ui-components-core';
import { BN } from 'utils/bignumber';

function lookupCDPSafetyLevel(ratio, ilkLiqRatio) {
  ratio = BN(ratio);
  ilkLiqRatio = BN(ilkLiqRatio);
  const dangerThreshold = BN(0.1)
    .times(ilkLiqRatio)
    .plus(ilkLiqRatio);
  const warningThreshold = BN(0.5)
    .times(ilkLiqRatio)
    .plus(ilkLiqRatio);
  let level;
  if (ratio.lt(dangerThreshold)) level = SAFETY_LEVELS.DANGER;
  else if (ratio.lt(warningThreshold)) level = SAFETY_LEVELS.WARNING;
  else level = SAFETY_LEVELS.SAFE;
  return { level, dangerThreshold, warningThreshold };
}

export const RatioDisplayTypes = {
  CARD: 'card',
  TEXT: 'text',
  PERCENTAGE: 'percentage'
};

export default function RatioDisplay({
  type = null,
  ratio,
  ilkLiqRatio,
  active,
  text,
  show = true,
  onlyWarnings = false,
  ...props
}) {
  if (!ratio || ratio === Infinity) return null;
  const { level, warningThreshold } = lookupCDPSafetyLevel(ratio, ilkLiqRatio);
  const showDisplay =
    show &&
    (onlyWarnings
      ? BN(ratio).lt(warningThreshold) && BN(ratio).gt(BN(ilkLiqRatio))
      : true);

  const overrides =
    level === SAFETY_LEVELS.WARNING && type === RatioDisplayTypes.CARD
      ? { textColor: '#826318' }
      : undefined;
  const { textColor, backgroundColor, borderColor } = getSafetyLevels({
    level,
    overrides
  });

  switch (type) {
    case RatioDisplayTypes.TEXT:
      return showDisplay ? (
        <Text color={textColor} {...props}>
          {text}
        </Text>
      ) : null;
    case RatioDisplayTypes.CARD:
      return showDisplay ? (
        <Card p="m" bg={backgroundColor} borderColor={borderColor} {...props}>
          <Text color={textColor}>{text}</Text>
        </Card>
      ) : null;
    case RatioDisplayTypes.PERCENTAGE:
    default:
      return showDisplay ? (
        <Text color={active ? 'white' : textColor} {...props}>
          {ratio}%
        </Text>
      ) : null;
  }
}
