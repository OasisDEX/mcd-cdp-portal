import Maker, { USD, DAI } from '@makerdao/dai';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

import config from 'references/config';

const { defaultNetwork, rpcUrls } = config;

// TODO: remove old listeners and attach fresh ones after reinstantiating

let maker;
export function getMaker() {
  return maker;
}

// default
export function initializeMaker() {
  maker = Maker.create('http', {
    log: false,
    provider: {
      url: rpcUrls[defaultNetwork],
      type: 'HTTP'
    }
  });

  // for debugging
  window.maker = maker;
  return maker.authenticate();
}

// for swapping rpcURLs
export async function reInstantiateMaker({ rpcURL }) {
  try {
    maker = Maker.create('http', {
      log: false,
      plugins: [trezorPlugin, ledgerPlugin],
      provider: {
        url: rpcURL,
        type: 'HTTP'
      }
    });

    window.maker = maker;
    await maker.authenticate();
    return {
      notFound: false,
      addresses: {}
    };
  } catch (_) {
    return { notFound: true, addresses: {} };
  }
}

export { USD, DAI };

// Helpers --------------------------------------------------------------------

export function awaitMakerAuthentication() {
  return maker.authenticate();
}
