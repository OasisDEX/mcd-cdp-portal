import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, { ETH, MKR } from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import { createCurrency } from '@makerdao/currency';

import proxyRegistryAbi from 'references/proxyRegistry.abi.json';
import gemJoinAbi from 'references/gemJoin.abi.json';
import dsTokenAbi from 'references/dsToken.abi.json';

import ilks from 'references/ilks';

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
              ...ilks.map(({ currency, key, gem }) => ({
                currency,
                ilk: key,
                address: addresses[gem],
                abi: dsTokenAbi
              })),
              // Allows MKR currency address in SDK to be overridden
              {
                currency: createCurrency('MKR'),
                ilk: 'MKR',
                address: addresses.MCD_GOV,
                abi: dsTokenAbi
              }
            ],
            addressOverrides: { ...addresses }
          }
        ]
      ],
      smartContract: {
        addContracts: {}
      },
      provider: {
        url: rpcUrl,
        type: 'HTTP'
      }
    };

    for (let ilk of ilks) {
      const adapterName = `MCD_JOIN_${ilk.key}`;
      config.smartContract.addContracts[adapterName] = {
        abi: gemJoinAbi,
        address: addresses[adapterName]
      };
    }

    if (addresses.PROXY_REGISTRY) {
      config.smartContract.addContracts.PROXY_REGISTRY = {
        address: addresses.PROXY_REGISTRY,
        abi: proxyRegistryAbi
      };
    }

    _maker = await Maker.create('http', config);

    // for debugging
    window.maker = _maker;
  }

  return { maker: _maker, reinstantiated };
}

export { USD, DAI, MKR, ETH };
