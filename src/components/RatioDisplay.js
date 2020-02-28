import React from 'react';
import { getSafetyLevels } from 'styles/theme';
import { SAFETY_LEVELS } from 'utils/constants';
import { Text, Card } from '@makerdao/ui-components-core';
import BigNumber from 'bignumber.js';

function lookupCDPSafetyLevel(ratio, ilkLiqRatio) {
  const dangerThreshold = BigNumber(0.1)
    .times(ilkLiqRatio)
    .plus(ilkLiqRatio);
  const warningThreshold = BigNumber(0.5)
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
  if (!BigNumber.isBigNumber(ratio)) ratio = BigNumber(ratio);

  if (!BigNumber.isBigNumber(ilkLiqRatio)) ilkLiqRatio = BigNumber(ilkLiqRatio);

  const { level, warningThreshold } = lookupCDPSafetyLevel(ratio, ilkLiqRatio);
  const showDisplay =
    show &&
    (onlyWarnings
      ? ratio.lt(warningThreshold) && ratio.gte(ilkLiqRatio)
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
      return showDisplay && isFinite(ratio) ? (
        <Text color={active ? 'white' : textColor} {...props}>
          {ratio.toString()}%
        </Text>
      ) : null;
  }
}
