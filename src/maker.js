import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, { ETH, MKR } from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

import proxyRegistryAbi from 'references/proxyRegistry.abi.json';
import gemJoinAbi from 'references/gemJoin.abi.json';
// import dsTokenAbi from 'references/dsToken.abi.json';

import ilkList from 'references/ilkList';

let _maker;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({ rpcUrl, addresses, network }) {
  const params = new URL(window.location).searchParams;
  const mcdPluginConfig = {
    network,
    simplePriceFeeds: !!params.get('simplePriceFeeds')
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
    }
  };

  if (addresses) {
    mcdPluginConfig.addressOverrides = addresses;
    for (let ilk of ilkList) {
      const adapterName = `MCD_JOIN_${ilk.key.replace(/-/g, '_')}`;
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
  }

  const maker = await Maker.create('http', config);

  // for debugging
  window.maker = maker;

  return maker;
}

export { USD, DAI, MKR, ETH };
