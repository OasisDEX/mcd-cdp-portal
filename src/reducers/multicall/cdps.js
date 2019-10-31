import { getWatcher } from '../../watch';
import { toHex } from 'utils/ethereum';
import { INK, ART } from 'reducers/cdps';

export async function trackCdpById(maker, cdpId, dispatch) {
  const addresses = maker.service('smartContract').getContractAddresses();
  const cdp = await maker
    .service('mcd:cdpManager')
    .getCdp(cdpId, { prefetch: false });
  const cdpHandlerAddress = await cdp.getUrn();

  dispatch({ type: `cdp.${cdp.id}.ilk`, value: cdp.ilk });

  const urnStateCall = urnState(addresses)(cdp.ilk, cdpHandlerAddress, cdpId);
  getWatcher().tap(calls =>
    calls
      // filter out duplicate calls
      .filter(call => JSON.stringify(call) !== JSON.stringify(urnStateCall))
      .concat([urnStateCall])
  );
}

export const urnState = addresses => (ilk, urn, urnId) => ({
  target: addresses.MCD_VAT,
  call: ['urns(bytes32,address)(uint256,uint256)', toHex(ilk), urn],
  returns: [[`cdp.${urnId}.${INK}`], [`cdp.${urnId}.${ART}`]]
});
