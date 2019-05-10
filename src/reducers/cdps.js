import produce from 'immer';

import { getMaker } from '../maker';

const FETCHED_CDPS = 'cdps/FETCHED_CDPS';

export const initialState = {
  items: []
};

export async function fetchCdps(maker, address) {
  try {
    const proxy = await maker.service('proxy').getProxyAddress(address);
    if (!proxy) return { type: FETCHED_CDPS, payload: { cdps: [] } };

    const cdpManager = maker.service('mcd:cdpManager');
    const cdpIds = await cdpManager.getCdpIds(proxy);
    const cdps = await Promise.all(
      cdpIds.map(async ({ id }) => {
        return await cdpManager.getCdp(id);
      })
    );
    return { type: FETCHED_CDPS, payload: { cdps } };
  } catch (err) {
    return { type: FETCHED_CDPS, payload: { cdps: [] } };
  }
}

const reducer = produce((draft, { type, payload }) => {
  switch (type) {
    case FETCHED_CDPS:
      draft.items = payload.cdps.map(cdp => ({ id: cdp.id, cdp })) || [];
      break;
    default:
      break;
  }
}, initialState);

export default reducer;
