import { getWatcher } from '../../watch';
import { toHex } from 'utils/ethereum';
import { INK, ART, UNLOCKED_COLLATERAL } from 'reducers/cdps';

export async function trackCdpById(maker, cdpId, dispatch) {
  console.log('**** trackCdpById', cdpId);
  const addresses = maker.service('smartContract').getContractAddresses();
  const cdp = await maker
    .service('mcd:cdpManager')
    .getCdp(cdpId, { prefetch: false });
  const cdpHandlerAddress = await cdp.getUrn();

  dispatch({ type: `cdp.${cdp.id}.ilk`, value: cdp.ilk });

  const urnStateCall = urnState(addresses)(cdp.ilk, cdpHandlerAddress, cdpId);
  const gemStateCall = gemState(addresses)(cdp.ilk, cdpHandlerAddress, cdpId);

  getWatcher().tap(calls =>
    calls
      // filter out duplicate calls
      .filter(call => JSON.stringify(call) !== JSON.stringify(urnStateCall))
      .concat([urnStateCall, gemStateCall])
  );
}

export const urnState = addresses => (ilk, urn, urnId) => ({
  target: addresses.MCD_VAT,
  call: ['urns(bytes32,address)(uint256,uint256)', toHex(ilk), urn],
  returns: [[`cdp.${urnId}.${INK}`], [`cdp.${urnId}.${ART}`]]
});

export const gemState = addresses => (ilk, urn, urnId) => ({
  target: addresses.MCD_VAT,
  call: ['gem(bytes32,address)(uint)', toHex(ilk), urn],
  returns: [[`cdp.${urnId}.${UNLOCKED_COLLATERAL}`]]
});
