import Maker, { USD, DAI } from '@makerdao/dai';
import configPlugin from '@makerdao/dai-plugin-config';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

let _testchainId;

// TODO: remove old listeners and attach fresh ones after reinstantiating

// default
let maker = Maker.create('http', {
  log: false,
  provider: {
    url: 'https://kovan.infura.io/',
    type: 'HTTP'
  }
});

// for swapping rpcURLs
export async function reInstantiateMaker({ rpcURL }) {
  maker = Maker.create('http', {
    log: false,
    plugins: [trezorPlugin, ledgerPlugin],
    provider: {
      url: rpcURL,
      type: 'HTTP'
    }
  });
  await maker.authenticate();
  return {};
}

// for Maker qa testchains
export async function reInstantiateMakerWithTestchain({ testchainId }) {
  _testchainId = testchainId;
  maker = Maker.create('http', {
    plugins: [[configPlugin, { testchainId }], trezorPlugin, ledgerPlugin],
    log: false
  });
  await maker.authenticate();
  return {};
}

export function getLastTestchainId() {
  return _testchainId;
}

export { USD, DAI };
export default maker;
