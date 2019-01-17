import Maker from '@makerdao/dai';

const maker = Maker.create('http', {
  log: false,
  provider: {
    url: `https://kovan.infura.io/`,
    type: 'HTTP'
  }
});

export default maker;
