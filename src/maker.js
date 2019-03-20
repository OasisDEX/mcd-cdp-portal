import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, { WETH, REP, ETH, MKR } from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import proxyRegistryAbi from 'references/proxyRegistry.abi.json';

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
export async function getOrReinstantiateMaker({ rpcUrl, addresses }) {
  let reinstantiated = false;
  if (rpcUrl !== _rpcUrl) {
    reinstantiated = true;

    _rpcUrl = rpcUrl;

    const config = {
      log: false,
      plugins: [
        trezorPlugin,
        ledgerPlugin,
        [
          McdPlugin,
          {
            cdpTypes: [
              { currency: WETH, name: 'ETH' },
              { currency: REP, name: 'REP' }
            ],
            addressOverrides: { ...addresses }
          }
        ]
      ],
      provider: {
        url: rpcUrl,
        type: 'HTTP'
      }
    };

    if (addresses.PROXY_REGISTRY) {
      config.smartContract = {
        addContracts: {
          PROXY_REGISTRY: {
            address: addresses.PROXY_REGISTRY,
            abi: proxyRegistryAbi
          }
        }
      };
    }

    _maker = await Maker.create('http', config);

    // for debugging
    window.maker = _maker;
  }

  return { maker: _maker, reinstantiated };
}

export { USD, DAI, MKR, ETH };
