import { parseUniPair } from '../TokenIcon';

test('parseUniPair works', () => {
  const pair1 = parseUniPair('UNIV2ETHDAI');
  expect(pair1[0]).toEqual('ETH');
  expect(pair1[1]).toEqual('DAI');

  const pair2 = parseUniPair('UNIV2BALRENBTC');
  expect(pair2[0]).toEqual('BAL');
  expect(pair2[1]).toEqual('RENBTC');

  const pair3 = parseUniPair('UNIV2PAXUSDRENBTC');
  expect(pair3[0]).toEqual('PAXUSD');
  expect(pair3[1]).toEqual('RENBTC');

  const pairNotFound = parseUniPair('UNIV2FOOBAR');
  expect(pairNotFound).toBeFalsy();

  const pairNotFound2 = parseUniPair('UNIV2ETHXXDAI');
  expect(pairNotFound2).toBeFalsy();

  const notLongEnough = parseUniPair('UNIV2ETHDA');
  expect(notLongEnough).toBeFalsy();

  const justWrong = parseUniPair('HELLOTHERE');
  expect(justWrong).toBeFalsy();
});
