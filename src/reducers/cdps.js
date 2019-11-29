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

export const mockEventDataFromSDK = [
  {
    type: 'GIVE',
    block: 14676816,
    txHash:
      '0x1613679179847ca3c137609c18ee1cfdfe4c24b54042a71469d8e654584e68e5',
    prevOwner: '0x90d01f84f8db06d9af09054fe06fb69c1f8ee9e9',
    id: 218,
    newOwner: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    timestamp: 1573234916
  },
  {
    type: 'PAY_BACK',
    block: 14676778,
    txHash:
      '0x9ed1546f3f76b33447c8ff685eb110d64ea9ce1bae5ecfaf0ca5d06477c8eb18',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0x90d01f84f8db06d9af09054fe06fb69c1f8ee9e9',
    recipient: '0x57b8cdd304c39f772f956bdb58003fd4f17391a2',
    amount: '0.052341071603344779',
    timestamp: 1573234764
  },
  {
    type: 'GIVE',
    block: 14676485,
    txHash:
      '0x1348b6cb087727663ea997fe96b66de260951e57ead17b01219d3ab581ca9bed',
    prevOwner: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    id: 218,
    newOwner: '0x90d01f84f8db06d9af09054fe06fb69c1f8ee9e9',
    timestamp: 1573233588
  },
  {
    type: 'PAY_BACK',
    block: 14676406,
    txHash:
      '0xff0eeab88ad9f2ee908e9eabab184a5836870043d3fad9c899f3ba99f83fa1e7',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    recipient: '0x57b8cdd304c39f772f956bdb58003fd4f17391a2',
    amount: '0.00987',
    timestamp: 1573233272
  },
  {
    type: 'GENERATE',
    block: 14676399,
    txHash:
      '0xb94c9b46c5d48f9ac39199a14f531f324e8f4dc0ba94b7a909857f219a3b5ce2',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    recipient: '0x7227bd52777cb85a89cb5f9eaf8e18f95ad91071',
    amount: '0.00789',
    timestamp: 1573233244
  },
  {
    type: 'WITHDRAW',
    block: 14676389,
    txHash:
      '0x56435b544ead6b5ceb99bf7a601bb46fedc6e7acde67fcff37a1862673fd09a6',
    id: 218,
    ilk: 'ETH-A',
    gem: 'ETH',
    adapter: '0xb597803e4b5b2a43a92f3e1dcafea5425c873116',
    amount: '0.000456',
    timestamp: 1573233204
  },
  {
    type: 'DEPOSIT',
    block: 14676205,
    txHash:
      '0xa7eca69f08404a291d225e6039e0344a764b0ec53a4d3050cda6161f9f7275aa',
    id: 218,
    ilk: 'ETH-A',
    gem: 'ETH',
    adapter: '0xb597803e4b5b2a43a92f3e1dcafea5425c873116',
    amount: '0.00001',
    timestamp: 1573232468
  },
  {
    type: 'GENERATE',
    block: 14676186,
    txHash:
      '0x490b3114259cf08408455e8f4b73237cd7861769e5a380c999cb1f0819bb46ed',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    recipient: '0x7227bd52777cb85a89cb5f9eaf8e18f95ad91071',
    amount: '0.054321',
    timestamp: 1573232392
  },
  {
    type: 'DEPOSIT',
    block: 14676186,
    txHash:
      '0x490b3114259cf08408455e8f4b73237cd7861769e5a380c999cb1f0819bb46ed',
    id: 218,
    ilk: 'ETH-A',
    gem: 'ETH',
    adapter: '0xb597803e4b5b2a43a92f3e1dcafea5425c873116',
    amount: '10000',
    timestamp: 1573232392
  },
  {
    type: 'OPEN',
    block: 14676186,
    txHash:
      '0x490b3114259cf08408455e8f4b73237cd7861769e5a380c999cb1f0819bb46ed',
    id: 218,
    ilk: 'ETH-A',
    timestamp: 1573232392
  }
];

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
