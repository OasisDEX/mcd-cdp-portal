import produce from 'immer';

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
      cdpIds.map(({ id }) => cdpManager.getCdp(id))
    );
    return { type: FETCHED_CDPS, payload: { cdps } };
  } catch (err) {
    return { type: FETCHED_CDPS, payload: { cdps: [] } };
  }
}

const reducer = produce((draft, { type, payload }) => {
  switch (type) {
    case FETCHED_CDPS:
      draft.items = payload.cdps || [];
      break;
    default:
      break;
  }
}, initialState);

export default reducer;
