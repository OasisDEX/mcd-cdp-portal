import Maker, { USD, DAI } from '@makerdao/dai';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

let _maker = null;
let _rpcUrl = null;

export function getMaker() {
  if (_maker === null) throw new Error('Maker has not been instatiated');
  return _maker;
}

/**
 * @desc if the rpcUrl has changed, instantiate a new maker instance
 * otherwise, return the current maker instance
 */
export async function getOrReinstantiateMaker({ rpcUrl }) {
  if (rpcUrl !== _rpcUrl) {
    _rpcUrl = rpcUrl;

    _maker = Maker.create('http', {
      log: false,
      plugins: [trezorPlugin, ledgerPlugin],
      provider: {
        url: rpcUrl,
        type: 'HTTP'
      }
    });

    await _maker.authenticate();

    // for debugging
    window.maker = _maker;
  }

  return _maker;
}

export { USD, DAI };
