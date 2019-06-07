import produce from 'immer';
import round from 'lodash/round';
import { multiply, divide, subtract } from 'utils/bignumber';
import { getIlkData } from './feeds';
import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';
import { fromWei } from 'utils/units';

export const INK = 'ink';
export const ART = 'art';

export const initialState = {};

const defaultCdpState = {
  inited: false,
  [INK]: '',
  [ART]: '',
  ilk: ''
};

export function getCdp(cdpId, state) {
  cdpId = cdpId.toString();
  if (!state.cdps[cdpId]) return defaultCdpState;
  else
    return {
      ...state.cdps[cdpId],
      ...getIlkData(state.feeds, state.cdps[cdpId].ilk)
    };
}

export function getDebtAmount(cdp, rounded = true, precision = 2) {
  if (!cdp.art || !cdp.ilkRate) return '';
  return rounded
    ? round(multiply(cdp.art, cdp.ilkRate), precision)
    : multiply(cdp.art, cdp.ilkRate);
}

export function getLiquidationPrice(cdp, rounded = true, precision = 2) {
  if (!cdp.liquidationRatio || !cdp.ink) return '';
  const debtAmount = getDebtAmount(cdp, false);
  if (!debtAmount) return '';
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
  if (!debtAmount) return '';
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

export function getEventHistory(cdp) {
  //return cdp.getEventHistory();
  return mockHistoryDataFromSDK; //TODO switch to real data
}

export const mockHistoryDataFromSDK = [
  {
    transactionHash:
      '0xbe023a205453b833e65bf29063de8b8b3bd44d2e68c9c079f681ec46a765a63f',
    changeInCollateral: ETH(99.5),
    collateralAction: 'free',
    time: new Date(Date.now()),
    senderAddress: '0x1ad35418e7b7c5746ea42295a1100480a810256a',
    resultingCollateral: ETH(900.5),
    resultingDebt: MDAI(10090),
    ilk: 'ETH-A'
  },
  {
    transactionHash:
      '0xbe023a205453b833e65bf29063de8b8b3bd44d2e68c9c079f681ec46a765a63f',
    changeInCollateral: ETH(0),
    changeInDai: MDAI(1000),
    daiAction: 'wipe',
    time: new Date(Date.now() - 10000000000),
    senderAddress: '0x1ad35418e7b7c5746ea42295a1100480a810256a',
    resultingCollateral: ETH(1000),
    resultingDebt: MDAI(10045),
    ilk: 'ETH-A'
  },
  {
    transactionHash:
      '0xbe023a205453b833e65bf29063de8b8b3bd44d2e68c9c079f681ec46a765a63f',
    changeInCollateral: ETH(10000),
    collateralAction: 'lock',
    changeInDai: MDAI(120000),
    daiAction: 'draw',
    time: new Date(Date.now() - 20000000000),
    senderAddress: '0x1ad35418e7b7c5746ea42295a1100480a810256a',
    resultingCollateral: ETH(1000),
    resultingDebt: MDAI(1100),
    ilk: 'ETH-A'
  }
];

function convert(valueType, value) {
  switch (valueType) {
    case INK:
    case ART:
      return fromWei(value);
    default:
      return value;
  }
}

const reducer = produce((draft, { type, value }) => {
  if (!type) return;
  const [label, cdpId, valueType, ilk] = type.split('.');
  if (label === 'cdp') {
    if (draft[cdpId]) draft[cdpId][valueType] = convert(valueType, value);
    else
      draft[cdpId] = {
        ...defaultCdpState,
        inited: true,
        [valueType]: convert(valueType, value),
        ilk
      };
  }
}, initialState);

export default reducer;
