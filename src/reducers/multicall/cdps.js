// import { getWatcher } from '../../watch';

import { toHex } from 'utils/ethereum';
import { fromWei } from 'utils/units';
import { INK, ART } from 'reducers/cdps';

// export async function watchCdps() {
//   // this will dispatch actions as a side effect
//   getWatcher().tap(calls => {
//     return calls.concat([ink]);
//   });
// }

export const urn = addresses => (ilk, urn, urnId) => ({
  target: addresses.MCD_VAT,
  call: ['urns(bytes32,address)(uint256,uint256)', toHex(ilk), urn],
  returns: [
    [`${urnId}.${INK}`, val => fromWei(val)],
    [`${urnId}.${ART}`, val => fromWei(val)]
  ]
});
