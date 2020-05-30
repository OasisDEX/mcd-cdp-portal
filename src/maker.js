import Maker, { USD, DAI, SAI } from '@makerdao/dai';
import McdPlugin, {
  ETH,
  BAT,
  USDC,
  WBTC,
  TUSD
} from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import walletLinkPlugin from '@makerdao/dai-plugin-walletlink';
import walletConnectPlugin from '@makerdao/dai-plugin-walletconnect';
import configPlugin from '@makerdao/dai-plugin-config';
import networkConfig from './references/config';
import { networkNameToId } from './utils/network';
import { getQueryParamByName } from './utils/dev';

import rinkebyAddresses from './references/contracts/rinkeby';
import goerliAddresses from './references/contracts/goerli';
import ropstenAddresses from './references/contracts/ropsten';

let _maker;

const otherNetworksOverrides = [
  {
    network: 'rinkeby',
    contracts: rinkebyAddresses
  },
  { network: 'goerli', contracts: goerliAddresses },
  { network: 'ropsten', contracts: ropstenAddresses }
].reduce((acc, { network, contracts }) => {
  for (const [contractName, contractAddress] of Object.entries(contracts)) {
    if (!acc[contractName]) acc[contractName] = {};
    acc[contractName][network] = contractAddress;
  }
  return acc;
}, {});

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

const cdpTypes = [
  { currency: ETH, ilk: 'ETH-A' },
  { currency: BAT, ilk: 'BAT-A' },
  { currency: USDC, ilk: 'USDC-A', decimals: 6 },
  { currency: WBTC, ilk: 'WBTC-A', decimals: 8 },
  { currency: USDC, ilk: 'USDC-B', decimals: 6 },
  { currency: TUSD, ilk: 'TUSD-A', decimas: 18 }
];

export async function instantiateMaker({
  rpcUrl,
  network,
  testchainId,
  backendEnv
}) {
  const addressOverrides = ['rinkeby', 'ropsten', 'goerli'].some(
    networkName => networkName === network
  )
    ? otherNetworksOverrides
    : {};

  const mcdPluginConfig = {
    cdpTypes,
    prefetch: false,
    addressOverrides
  };
  const walletLinkPluginConfig = {
    rpcUrl: networkConfig.rpcUrls[networkNameToId(network)]
  };

  const config = {
    log: false,
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      [walletLinkPlugin, walletLinkPluginConfig],
      walletConnectPlugin,
      [McdPlugin, mcdPluginConfig]
    ],
    smartContract: {
      addressOverrides
    },
    provider: {
      url: rpcUrl,
      type:
        network === 'testnet'
          ? 'HTTP'
          : getQueryParamByName('ws') === '0'
          ? 'HTTP'
          : 'WEBSOCKET'
    },
    web3: {
      pollingInterval: network === 'testnet' ? 100 : null
    },
    multicall: true
  };

  // Use the config plugin, if we have a testchainConfigId
  if (testchainId) {
    delete config.provider;
    config.plugins.push([configPlugin, { testchainId, backendEnv }]);
  } else if (!rpcUrl) {
    if (config.provider.type === 'HTTP')
      rpcUrl = networkConfig.rpcUrls[networkNameToId(network)];
    else if (config.provider.type === 'WEBSOCKET')
      rpcUrl = networkConfig.wsRpcUrls[networkNameToId(network)];
    else throw new Error(`Unsupported provider type: ${config.provider.type}`);
    if (!rpcUrl) throw new Error(`Unsupported network: ${network}`);
    config.provider.url = rpcUrl;
  }

  const maker = await Maker.create('http', config);

  // for debugging
  window.maker = maker;

  return maker;
}

export { USD, DAI, ETH, BAT, SAI, USDC };
