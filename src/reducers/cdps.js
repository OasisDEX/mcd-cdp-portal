import produce from 'immer';
import { getWatcher } from '../watch';
import { urn } from './multicall/cdps';

const FETCHED_CDPS = 'cdps/FETCHED_CDPS';
export const INK = 'ink';
export const ART = 'art';

export const initialState = {
  items: []
};

const defaultCdpState = {
  [INK]: '',
  [ART]: ''
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

    getWatcher().tap(model =>
      model.concat(
        ...cdpAddressHandlers.map((addressHandler, idx) => {
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

    getWatcher().tap(model =>
      model.concat([urn(addresses)(cdp.ilk, cdpAddressHandler, cdpId)])
    );

    return { type: FETCHED_CDPS, payload: { cdps: [cdp] } };
  } catch (err) {
    return { type: FETCHED_CDPS, payload: { cdps: [] } };
  }
}

export function getCdp(cdpId, cdps) {
  cdpId = cdpId.toString();
  if (!cdps[cdpId]) return defaultCdpState;
  else return cdps[cdpId];
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
  const [key, valueType] = type.split('.');
  if (defaultCdpState.hasOwnProperty(valueType)) {
    if (draft[key]) draft[key][valueType] = value;
    else
      draft[key] = {
        ...defaultCdpState,
        [valueType]: value
      };
  }
}, initialState);

export default reducer;
