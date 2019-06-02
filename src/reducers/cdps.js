import produce from 'immer';
import round from 'lodash/round';
import { multiply, divide, subtract } from 'utils/bignumber';
import { getWatcher } from '../watch';
import { urn } from './multicall/cdps';
import { getIlkData } from './feeds';

const FETCHED_CDPS = 'cdps/FETCHED_CDPS';
export const INK = 'ink';
export const ART = 'art';

export const initialState = {
  items: []
};

const defaultCdpState = {
  [INK]: '',
  [ART]: '',
  ilk: ''
};

export async function fetchCdpsByAddress(maker, address) {
  try {
    const proxy = await maker.service('proxy').getProxyAddress(address);
    if (!proxy) return { type: FETCHED_CDPS, payload: { cdps: [] } };

    const cdpManager = maker.service('mcd:cdpManager');
    const cdpIds = await cdpManager.getCdpIds(proxy);
    const cdps = await Promise.all(
      cdpIds.map(({ id }) => cdpManager.getCdp(id))
    );
    const cdpAddressHandlers = await Promise.all(
      cdpIds.map(({ id }) => cdpManager.getUrn(id))
    );
    const addresses = maker.service('smartContract').getContractAddresses();

    getWatcher().tap(calls =>
      calls.concat(
        cdpAddressHandlers.map((addressHandler, idx) => {
          const ilk = cdpIds[idx].ilk;
          const cdpId = cdpIds[idx].id;
          return urn(addresses)(ilk, addressHandler, cdpId);
        })
      )
    );

    return { type: FETCHED_CDPS, payload: { cdps } };
  } catch (err) {
    return { type: FETCHED_CDPS, payload: { cdps: [] } };
  }
}

export async function fetchCdpById(maker, cdpId) {
  try {
    const cdpManager = maker.service('mcd:cdpManager');
    const cdp = await cdpManager.getCdp(cdpId);
    const cdpAddressHandler = await cdpManager.getUrn(cdpId);

    const addresses = maker.service('smartContract').getContractAddresses();

    getWatcher().tap(calls =>
      calls.concat([urn(addresses)(cdp.ilk, cdpAddressHandler, cdpId)])
    );
  } catch (err) {
    console.error('failed to add cdps to state watcher', err);
  }
}

export function getCdp(cdpId, state) {
  cdpId = cdpId.toString();
  if (!state.cdps[cdpId]) return defaultCdpState;
  else
    return {
      ...state.cdps[cdpId],
      ...getIlkData(state.feeds, state.cdps[cdpId].ilk)
    };
}

export function getDebtAmount(cdp) {
  if (!cdp.art || !cdp.ilkRate) return '';
  return round(multiply(cdp.art, cdp.ilkRate), 2);
}

export function getLiquidationPrice(cdp) {
  if (!cdp.liquidationRatio || !cdp.ink) return '';
  const debtAmount = getDebtAmount(cdp);
  if (!debtAmount) return '';
  return round(divide(multiply(debtAmount, cdp.liquidationRatio), cdp.ink), 2);
}

export function getCollateralPrice(cdp) {
  if (!cdp.price) return '';
  return round(cdp.price.toNumber(), 2);
}

export function getCollateralAmount(cdp) {
  if (!cdp.ink) return '';
  return round(cdp.ink, 2);
}

export function getCollateralValueUSD(cdp) {
  if (!cdp.ink) return '';
  const collateralPrice = getCollateralPrice(cdp);
  if (!collateralPrice) return;
  return round(multiply(cdp.ink, collateralPrice), 2);
}

export function getCollateralizationRatio(cdp) {
  const collateralValueUSD = getCollateralValueUSD(cdp);
  if (!collateralValueUSD) return '';
  const debtAmount = getDebtAmount(cdp);
  if (!debtAmount) return '';
  return round(divide(collateralValueUSD, debtAmount) * 100, 2);
}

export function getMinCollateralNeeded(cdp) {
  if (!cdp.liquidationRatio) return '';
  const debtAmount = getDebtAmount(cdp);
  if (!debtAmount) return '';
  const collateralValueUSD = getCollateralValueUSD(cdp);
  if (!collateralValueUSD) return '';
  return round(
    divide(
      multiply(debtAmount, cdp.liquidationRatio / 100),
      collateralValueUSD
    ),
    2
  );
}

export function getCollateralAvailableAmount(cdp) {
  const collateralAmount = getCollateralAmount(cdp);
  if (!collateralAmount) return '';
  const minCollateralNeeded = getMinCollateralNeeded(cdp);
  if (!minCollateralNeeded) return '';
  const collateralAvailableAmount = subtract(
    collateralAmount,
    minCollateralNeeded
  );
  return round(
    collateralAvailableAmount < 0 ? 0 : collateralAvailableAmount,
    2
  );
}

export function getCollateralAvailableValue(cdp) {
  const collateralAvailableAmount = getCollateralAvailableAmount(cdp);
  if (!collateralAvailableAmount) return '';
  const collateralPrice = getCollateralPrice(cdp);
  if (!collateralPrice) return;
  return round(multiply(collateralAvailableAmount, collateralPrice), 2);
}

export function getDaiAvailable(cdp) {
  if (!cdp.liquidationRatio) return '';
  const collateralValueUSD = getCollateralValueUSD(cdp);
  if (!collateralValueUSD) return '';
  const debtAmount = getDebtAmount(cdp);
  if (!debtAmount) return '';
  return round(
    subtract(
      divide(collateralValueUSD, cdp.liquidationRatio / 100),
      debtAmount
    ),
    2
  );
}

const reducer = produce((draft, { type, payload, value }) => {
  switch (type) {
    case FETCHED_CDPS:
      draft.items = payload.cdps || [];
      break;
    default:
      break;
  }
  if (!type) return;
  const [cdpId, valueType, ilk] = type.split('.');
  if (defaultCdpState.hasOwnProperty(valueType)) {
    if (draft[cdpId]) draft[cdpId][valueType] = value;
    else
      draft[cdpId] = {
        ...defaultCdpState,
        [valueType]: value,
        ilk
      };
  }
}, initialState);

export default reducer;
