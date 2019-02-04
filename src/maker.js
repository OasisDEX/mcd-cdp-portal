import Maker, { USD, DAI } from '@makerdao/dai';

let maker = Maker.create('http', {
  log: false,
  provider: {
    url: 'https://kovan.infura.io/',
    type: 'HTTP'
  }
});

export function reInstantiateMaker(rpcURL) {
  maker = Maker.create('http', {
    log: false,
    provider: {
      url: rpcURL,
      type: 'HTTP'
    }
  });
  return maker.authenticate();
}

export { USD, DAI };
export default maker;
