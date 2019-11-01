import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, {
  ETH,
  MKR,
  REP,
  ZRX,
  OMG,
  BAT,
  DGD,
  GNT
} from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import walletLinkPlugin from '@makerdao/dai-plugin-walletlink';
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
  backendEnv,
  navigation
}) {
  let mainnetAddresses;
  if (network === 'mainnet') {
    // Fallback to kovan if mainnet addresses are not found
    try {
      mainnetAddresses = require('./references/mainnet.json');
    } catch (e) {
      navigation.navigate(
        `${navigation.getCurrentValue().url.pathname}?network=kovan`
      );
      network = 'kovan';
      console.error(e);
    }
  }

  const mainnetOverride = { addresses: mainnetAddresses, network: 'mainnet' };
  const kovanCdpTypes = [
    { currency: ETH, ilk: 'ETH-A' },
    { currency: ETH, ilk: 'ETH-B' },
    { currency: REP, ilk: 'REP-A' },
    { currency: ZRX, ilk: 'ZRX-A' },
    { currency: OMG, ilk: 'OMG-A' },
    { currency: BAT, ilk: 'BAT-A' },
    { currency: DGD, ilk: 'DGD-A', decimals: 9 },
    { currency: GNT, ilk: 'GNT-A' }
  ];

  const mainnetCdpTypes = [
    { currency: ETH, ilk: 'ETH-A' },
    { currency: ETH, ilk: 'ETH-B' },
    { currency: ZRX, ilk: 'ZRX-A' },
    { currency: BAT, ilk: 'BAT-A' }
  ];

  const mcdPluginConfig = {
    cdpTypes: network === 'mainnet' ? mainnetCdpTypes : kovanCdpTypes,
    override: network === 'mainnet' ? mainnetOverride : null,
    prefetch: false
  };

  const config = {
    log: false,
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      walletLinkPlugin,
      [McdPlugin, mcdPluginConfig]
    ],
    smartContract: {
      addContracts: {}
    },
    provider: {
      url: rpcUrl,
      type: 'HTTP'
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
