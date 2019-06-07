import { getWatcher } from '../../watch';
import { toHex } from 'utils/ethereum';

export const INK = 'ink';
export const ART = 'art';

export async function trackCdpById(maker, cdpId, dispatch) {
  const addresses = maker.service('smartContract').getContractAddresses();
  const cdp = await maker.service('mcd:cdpManager').getCdp(cdpId);
  dispatch({
    type: 'watcherUpdates',
    payload: [{ type: `urn.${cdp.id}.ilk`, value: cdp.ilk }]
  });
  const cdpHandlerAddress = await cdp.getUrn();

  const urnStateCall = urnState(addresses)(cdp.ilk, cdpHandlerAddress, cdpId);
  return getWatcher().tap(calls =>
    calls
      // filter out duplicate calls
      .filter(call => JSON.stringify(call) !== JSON.stringify(urnStateCall))
      .concat([urnStateCall])
  );
}

export const urnState = addresses => (ilk, urn, urnId) => ({
  target: addresses.MCD_VAT,
  call: ['urns(bytes32,address)(uint256,uint256)', toHex(ilk), urn],
  returns: [[`urn.${urnId}.${INK}`], [`urn.${urnId}.${ART}`]]
});
