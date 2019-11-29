import produce from 'immer';
import round from 'lodash/round';
import { multiply, divide, subtract } from 'utils/bignumber';
import { getIlkData } from './feeds';
import { fromWei } from 'utils/units';

export const INK = 'ink';
export const ART = 'art';
export const UNLOCKED_COLLATERAL = 'unlockedCollateral';

export const initialState = {};

const defaultCdpState = {
  inited: false,
  [INK]: '',
  [ART]: '',
  [UNLOCKED_COLLATERAL]: '',
  ilk: ''
};

export function getCdp(cdpId, { cdps, feeds }) {
  cdpId = cdpId.toString();
  feeds = feeds.filter(feed => feed !== undefined);
  if (!cdps[cdpId] || feeds.length === 0) return defaultCdpState;
  else
    return {
      id: cdpId,
      ...cdps[cdpId],
      ...getIlkData(feeds, cdps[cdpId].ilk)
    };
}

export function getDebtAmount(cdp, rounded = true, precision = 2) {
  if (!cdp.art || !cdp.rate) return '';
  return rounded
    ? round(multiply(cdp.art, cdp.rate), precision)
    : multiply(cdp.art, cdp.rate);
}

export function getLiquidationPrice(cdp, rounded = true, precision = 2) {
  if (!cdp.liquidationRatio || !cdp.ink) return '';
  const debtAmount = getDebtAmount(cdp, false);
  if (!debtAmount) return '';
  if (!parseFloat(cdp.ink)) return Infinity;
  const val = divide(multiply(debtAmount, cdp.liquidationRatio / 100), cdp.ink);
  return rounded ? round(val, precision) : val;
}

export function getCollateralPrice(cdp, rounded = true, precision = 2) {
  if (!cdp.price) return '';
  return rounded
    ? round(cdp.price.toNumber(), precision)
    : cdp.price.toNumber();
}

export function getCollateralAmount(cdp, rounded = true, precision = 2) {
  if (!cdp.ink) return '';
  return rounded ? round(cdp.ink, precision) : cdp.ink;
}

export function getUnlockedCollateralAmount(
  cdp,
  rounded = true,
  precision = 2
) {
  if (!cdp.unlockedCollateral) return '';
  return rounded
    ? round(cdp.unlockedCollateral, precision)
    : cdp.unlockedCollateral;
}

export function getCollateralValueUSD(cdp, rounded = true, precision = 2) {
  if (!cdp.ink) return '';
  const collateralPrice = getCollateralPrice(cdp, false);
  if (!collateralPrice) return;
  return rounded
    ? round(multiply(cdp.ink, collateralPrice), precision)
    : multiply(cdp.ink, collateralPrice);
}

export function getCollateralizationRatio(cdp, rounded = true, precision = 2) {
  const collateralValueUSD = getCollateralValueUSD(cdp, false);
  if (!collateralValueUSD) return '';
  const debtAmount = getDebtAmount(cdp, false);
  if (!parseFloat(debtAmount)) return Infinity;
  return rounded
    ? round(multiply(divide(collateralValueUSD, debtAmount), 100), precision)
    : multiply(divide(collateralValueUSD, debtAmount), 100);
}

export function getMinCollateralNeeded(cdp, rounded = true, precision = 2) {
  if (!cdp.liquidationRatio) return '';
  const debtAmount = getDebtAmount(cdp, false);
  if (!debtAmount) return '';
  const collateralPrice = getCollateralPrice(cdp, false);
  if (!collateralPrice) return '';
  return rounded
    ? round(
        divide(
          multiply(debtAmount, divide(cdp.liquidationRatio, 100)),
          collateralPrice
        ),
        precision
      )
    : divide(
        multiply(debtAmount, divide(cdp.liquidationRatio, 100)),
        collateralPrice
      );
}

export function getCollateralAvailableAmount(
  cdp,
  rounded = true,
  precision = 2
) {
  const collateralAmount = getCollateralAmount(cdp, false);
  if (!collateralAmount) return '';
  const minCollateralNeeded = getMinCollateralNeeded(cdp, false);
  if (!minCollateralNeeded) return '';
  const collateralAvailableAmount = subtract(
    collateralAmount,
    minCollateralNeeded
  );
  return rounded
    ? round(
        collateralAvailableAmount < 0 ? 0 : collateralAvailableAmount,
        precision
      )
    : collateralAvailableAmount < 0
    ? 0
    : collateralAvailableAmount;
}

export function getCollateralAvailableValue(
  cdp,
  rounded = true,
  precision = 2
) {
  const collateralAvailableAmount = getCollateralAvailableAmount(cdp, false);
  if (!collateralAvailableAmount) return '';
  const collateralPrice = getCollateralPrice(cdp, false);
  if (!collateralPrice) return;
  return rounded
    ? round(multiply(collateralAvailableAmount, collateralPrice), precision)
    : multiply(collateralAvailableAmount, collateralPrice);
}

export function getDaiAvailable(cdp, rounded = true, precision = 2) {
  if (!cdp.liquidationRatio) return '';
  const collateralValueUSD = getCollateralValueUSD(cdp, false);
  if (!collateralValueUSD) return '';
  const debtAmount = getDebtAmount(cdp, false);
  if (!debtAmount) return '';
  return rounded
    ? round(
        subtract(
          divide(collateralValueUSD, cdp.liquidationRatio / 100),
          debtAmount
        ),
        precision
      )
    : subtract(
        divide(collateralValueUSD, cdp.liquidationRatio / 100),
        debtAmount
      );
}

export async function getEventHistory(maker, cdpId) {
  const cdp = await maker
    .service('mcd:cdpManager')
    .getCdp(cdpId, { prefetch: false });
  const events = await maker.service('mcd:cdpManager').getEventHistory(cdp);
  return events;
}

function convert(valueType, value) {
  switch (valueType) {
    case INK:
    case ART:
    case UNLOCKED_COLLATERAL:
      return fromWei(value);
    default:
      return value;
  }
}

const reducer = produce((draft, { type, value }) => {
  if (!type) return;
  const [label, cdpId, valueType] = type.split('.');
  if (label === 'cdp') {
    if (draft[cdpId]) draft[cdpId][valueType] = convert(valueType, value);
    else
      draft[cdpId] = {
        ...defaultCdpState,
        inited: true,
        [valueType]: convert(valueType, value)
      };
  }
}, initialState);

export default reducer;
