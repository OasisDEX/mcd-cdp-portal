import ReactDOMServer from 'react-dom/server';
import {
  formatEventDescription,
  firstLetterLowercase,
  parseUniPair
} from '../ui';
import lang from '../../languages';

export const mockEventDataFromSDK = [
  {
    type: 'GIVE',
    block: 14676816,
    txHash:
      '0x1613679179847ca3c137609c18ee1cfdfe4c24b54042a71469d8e654584e68e5',
    prevOwner: '0x90d01f84f8db06d9af09054fe06fb69c1f8ee9e9',
    id: 218,
    newOwner: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    timestamp: 1573234916
  },
  {
    type: 'PAY_BACK',
    block: 14676778,
    txHash:
      '0x9ed1546f3f76b33447c8ff685eb110d64ea9ce1bae5ecfaf0ca5d06477c8eb18',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0x90d01f84f8db06d9af09054fe06fb69c1f8ee9e9',
    recipient: '0x57b8cdd304c39f772f956bdb58003fd4f17391a2',
    amount: '0.052341071603344779',
    timestamp: 1573234764
  },
  {
    type: 'GIVE',
    block: 14676485,
    txHash:
      '0x1348b6cb087727663ea997fe96b66de260951e57ead17b01219d3ab581ca9bed',
    prevOwner: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    id: 218,
    newOwner: '0x90d01f84f8db06d9af09054fe06fb69c1f8ee9e9',
    timestamp: 1573233588
  },
  {
    type: 'PAY_BACK',
    block: 14676406,
    txHash:
      '0xff0eeab88ad9f2ee908e9eabab184a5836870043d3fad9c899f3ba99f83fa1e7',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    recipient: '0x57b8cdd304c39f772f956bdb58003fd4f17391a2',
    amount: '0.00987',
    timestamp: 1573233272
  },
  {
    type: 'GENERATE',
    block: 14676399,
    txHash:
      '0xb94c9b46c5d48f9ac39199a14f531f324e8f4dc0ba94b7a909857f219a3b5ce2',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    recipient: '0x7227bd52777cb85a89cb5f9eaf8e18f95ad91071',
    amount: '0.00789',
    timestamp: 1573233244
  },
  {
    type: 'WITHDRAW',
    block: 14676389,
    txHash:
      '0x56435b544ead6b5ceb99bf7a601bb46fedc6e7acde67fcff37a1862673fd09a6',
    id: 218,
    ilk: 'ETH-A',
    gem: 'ETH',
    adapter: '0xb597803e4b5b2a43a92f3e1dcafea5425c873116',
    amount: '0.000456',
    timestamp: 1573233204
  },
  {
    type: 'DEPOSIT',
    block: 14676205,
    txHash:
      '0xa7eca69f08404a291d225e6039e0344a764b0ec53a4d3050cda6161f9f7275aa',
    id: 218,
    ilk: 'ETH-A',
    gem: 'ETH',
    adapter: '0xb597803e4b5b2a43a92f3e1dcafea5425c873116',
    amount: '0.00001',
    timestamp: 1573232468
  },
  {
    type: 'GENERATE',
    block: 14676186,
    txHash:
      '0x490b3114259cf08408455e8f4b73237cd7861769e5a380c999cb1f0819bb46ed',
    id: 218,
    ilk: 'ETH-A',
    adapter: '0x9e0d5a6a836a6c323cf45eb07cb40cfc81664eec',
    proxy: '0xdb2a2d8ac9f10f4d6041462758241844add6b9d1',
    recipient: '0x7227bd52777cb85a89cb5f9eaf8e18f95ad91071',
    amount: '0.054321',
    timestamp: 1573232392
  },
  {
    type: 'DEPOSIT',
    block: 14676186,
    txHash:
      '0x490b3114259cf08408455e8f4b73237cd7861769e5a380c999cb1f0819bb46ed',
    id: 218,
    ilk: 'ETH-A',
    gem: 'ETH',
    adapter: '0xb597803e4b5b2a43a92f3e1dcafea5425c873116',
    amount: '10000',
    timestamp: 1573232392
  },
  {
    type: 'OPEN',
    block: 14676186,
    txHash:
      '0x490b3114259cf08408455e8f4b73237cd7861769e5a380c999cb1f0819bb46ed',
    id: 218,
    ilk: 'ETH-A',
    timestamp: 1573232392
  }
];

function convert(valueType, value) {
  switch (valueType) {
    case INK:
    case ART:
    case UNLOCKED_COLLATERAL:
      return fromWei(value);
    default:
      return value;
  }
}

test('formatEventDescription', () => {
  expect(
    ReactDOMServer.renderToStaticMarkup(
      formatEventDescription(lang, mockEventDataFromSDK[8])
    )
  ).toBe('Deposited <b>10,000.00</b> ETH into Vault');
});

test('firstLetterLowercase', () => {
  expect(firstLetterLowercase('Word')).toBe('word');
});

test('parseUniPair works', () => {
  const tokens = ['ETH', 'DAI', 'BAL', 'RENBTC', 'PAXUSD'];
  const pair1 = parseUniPair('UNIV2ETHDAI', tokens);
  expect(pair1[0]).toEqual('ETH');
  expect(pair1[1]).toEqual('DAI');

  const pair2 = parseUniPair('UNIV2BALRENBTC', tokens);
  expect(pair2[0]).toEqual('BAL');
  expect(pair2[1]).toEqual('RENBTC');

  const pair3 = parseUniPair('UNIV2PAXUSDRENBTC', tokens);
  expect(pair3[0]).toEqual('PAXUSD');
  expect(pair3[1]).toEqual('RENBTC');

  const pairNotFound = parseUniPair('UNIV2FOOBAR', tokens);
  expect(pairNotFound).toBeFalsy();

  const pairNotFound2 = parseUniPair('UNIV2ETHXXDAI', tokens);
  expect(pairNotFound2).toBeFalsy();

  const notLongEnough = parseUniPair('UNIV2ETHDA', tokens);
  expect(notLongEnough).toBeFalsy();

  const justWrong = parseUniPair('HELLOTHERE', tokens);
  expect(justWrong).toBeFalsy();
});
