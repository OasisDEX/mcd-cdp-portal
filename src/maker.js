import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, { ETH, MKR } from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import configPlugin from '@makerdao/dai-plugin-config';
import networkConfig from './references/config';
import { networkNameToId } from './utils/network';

let _maker;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({
  rpcUrl,
  network,
  testchainId,
  backendEnv
}) {
  const mcdPluginConfig = {
    network: network === 'test' ? 'testnet' : network,
    prefetch: false
  };

  const config = {
    log: false,
    plugins: [trezorPlugin, ledgerPlugin, [McdPlugin, mcdPluginConfig]],
    smartContract: {
      addContracts: {}
    },
    provider: {
      url: rpcUrl,
      type: 'HTTP'
    },
    multicall: true
  };

  // Use the config plugin, if we have a testchainConfigId
  if (testchainId) {
    delete config.provider;
    config.plugins.push([configPlugin, { testchainId, backendEnv }]);
  } else if (!rpcUrl) {
    rpcUrl = networkConfig.rpcUrls[networkNameToId(network)];
    if (!rpcUrl) throw new Error(`Unsupported network: ${network}`);
    config.provider.url = rpcUrl;
  }

  const maker = await Maker.create('http', config);

  // for debugging
  window.maker = maker;

  return maker;
}

export { USD, DAI, MKR, ETH };
