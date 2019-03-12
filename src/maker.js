import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, { ETH, MKR } from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

let _maker;
let _rpcUrl;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

/**
 * @desc if the rpcUrl has changed, instantiate a new maker instance.
 * Otherwise, return the current maker instance
 */
export async function getOrReinstantiateMaker({ rpcUrl }) {
  let reinstantiated = false;
  if (rpcUrl !== _rpcUrl) {
    reinstantiated = true;

    _rpcUrl = rpcUrl;

    _maker = await Maker.create('http', {
      log: false,
      plugins: [
        trezorPlugin,
        ledgerPlugin,
        [
          McdPlugin,
          {
            cdpTypes: [{ currency: ETH, name: 'ETH' }]
          }
        ]
      ],
      provider: {
        url: rpcUrl,
        type: 'HTTP'
      }
    });

    // for debugging
    window.maker = _maker;
  }

  return { maker: _maker, reinstantiated };
}

export { USD, DAI, MKR, ETH };
