import Maker, { USD, DAI } from '@makerdao/dai';

const maker = Maker.create('http', {
  log: false,
  provider: {
    url: `https://kovan.infura.io/`,
    type: 'HTTP'
  }
});

export { USD, DAI };
export default maker;
