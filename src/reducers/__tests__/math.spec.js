import mathReducer from '../math';

test('feedValueUSD is calculated correctly', () => {
  const initialState = {
    system: {
      par: '1000000000000000000000000000'
    },
    feeds: [
      {
        key: 'ETH-A'
      }
    ]
  };

  const action = {
    type: 'watcherUpdates',
    payload: [
      {
        type: 'ilk.ETH-A.priceWithSafetyMargin',
        value: '178146666666666666666666666666'
      },
      {
        type: 'ilk.ETH-A.liquidationRatio',
        value: '1500000000000000000000000000'
      }
    ]
  };
  const newState = mathReducer(initialState, action);
  // spot * par * mat
  expect(newState.feeds[0].feedValueUSD.toNumber()).toEqual(267.22);
});

test('ilk debtAvailable is calculated correctly', () => {
  const initialState = {
    feeds: [
      {
        key: 'ETH-A'
      }
    ]
  };

  const action = {
    type: 'watcherUpdates',
    payload: [
      {
        type: 'ilk.ETH-A.ilkArt',
        value: '389460000000000000000'
      },
      {
        type: 'ilk.ETH-A.rate',
        value: '1000000000000000000000000000'
      },
      {
        type: 'ilk.ETH-A.debtCeiling',
        value: '300000000000000000000000000000000000000000000000000'
      }
    ]
  };
  const newState = mathReducer(initialState, action);
  // line - (art * rate)
  expect(newState.feeds[0].ilkDebtAvailable.toNumber()).toEqual(299610.54);
});

test('system collateralization is calculated correctly', () => {
  const initialState = {
    system: {
      par: '1000000000000000000000000000'
    },
    feeds: [
      {
        key: 'ETH-B'
      }
    ],
    raw: {
      ilks: {
        'ETH-B': {
          priceWithSafetyMargin: '157850000000000000000000000000',
          ilkArt: '2995628653904063343',
          rate: '1002000000000000000000000000',
          adapterBalance: '210000000000000000000000000'
        }
      }
    }
  };

  const action = {
    type: 'watcherUpdates',
    payload: [
      {
        type: 'ilk.ETH-A.liquidationRatio',
        value: '2000000000000000000000000000'
      }
    ]
  };
  const newState = mathReducer(initialState, action);
  console.log('newState', newState);
  console.log('newState.raw', newState.raw);
  //should be 2,208.99 % ?
  expect(newState.system.systemCollateralization.toNumber()).toEqual(500000000);
});
