import { getWatcher } from '../../watch';
import { toHex } from 'utils/ethereum';
import { INK, ART } from 'reducers/cdps';

export async function trackCdpById(maker, cdpId, _cdp = null) {
  const addresses = maker.service('smartContract').getContractAddresses();
  const cdp = _cdp ? _cdp : await maker.service('mcd:cdpManager').getCdp(cdpId);
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
  returns: [[`cdp.${urnId}.${INK}.${ilk}`], [`cdp.${urnId}.${ART}.${ilk}`]]
});
