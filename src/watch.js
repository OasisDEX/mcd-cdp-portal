import { createWatcher } from '@makerdao/multicall';
import store from './store';

import { batchActions } from 'utils/redux';

import config from 'references/config.json';
import addresses from 'references/addresses';
import ilks from 'references/ilks';
import { isMissingContractAddress } from 'utils/ethereum';

import * as accountWatcherCalls from 'reducers/network/account/calls';
import { createIlkWatcherCalls } from 'reducers/network/ilks/calls';
import { createSystemWatcherCalls } from 'reducers/network/system/calls';

const { defaultNetwork, rpcUrls } = config;

const defaultAddresses = addresses[defaultNetwork];

const watcher = createWatcher([], {
  rpcUrl: rpcUrls[defaultNetwork],
  multicallAddress: defaultAddresses.MULTICALL
});

window.watcher = watcher;

watcher.batch().subscribe(newStateEvents => {
  store.dispatch(batchActions(newStateEvents));
});

let _rpcUrl = null;

async function tapTokenAllowanceCalls(addresses, address, proxy) {
  watcher.tap(calls => [
    // Remove any existing token balance calls
    ...calls.filter(calldata => calldata.type !== 'token_allowance'),
    // Add token allowance calls for this wallet address and proxy
    ...store
      .getState()
      .network.account.tokens.map(({ key: gem }) =>
        accountWatcherCalls.tokenAllowance(addresses)(gem, address, proxy)
      )
  ]);
}

async function tapOnNewAddress(addresses) {
  watcher.tap(calls => [
    // Remove any existing token balance calls
    ...calls.filter(calldata => calldata.type !== 'token_balance'),
    // Add token balance calls for this wallet address
    ...store
      .getState()
      .network.account.tokens.map(({ key: gem }) =>
        accountWatcherCalls.tokenBalance(addresses)(gem, connectedAddress)
      )
  ]);
}

async function tapOnInitialize(addresses) {
  // do our best to attach state listeners to this new network
  await watcher.tap(() => {
    return [
      // add watcher calls for system variables
      ...createSystemWatcherCalls(addresses),
      // add watcher calls for the ilks we have
      ...ilks.reduce(
        (acc, { key }) => (
          // eslint-disable-next-line
          acc.push(...createIlkWatcherCalls(addresses, key)), acc
        ),
        []
      )
    ].filter(calldata => !isMissingContractAddress(calldata)); // (limited by the addresses we have)
  });
}

watcher.tapTokenAllowanceCalls = tapTokenAllowanceCalls;
watcher.tapOnInitialize = tapOnInitialize;
watcher.tapOnNewAddress = tapOnNewAddress;

export async function getOrRecreateWatcher({ rpcUrl, addresses }) {
  const recreated = _rpcUrl !== rpcUrl;

  if (recreated) {
    if (addresses.MULTICALL === undefined)
      throw new Error('No multicall address found');

    _rpcUrl = rpcUrl;

    watcher.reCreate([], {
      rpcUrl,
      multicallAddress: addresses.MULTICALL
    });

    watcher.tapOnInitialize(addresses);
  }
  return { watcher, recreated };
}

// watcher
//   .onNetworkTrouble(() => {
//     store.dispatch({ type: 'PROBLEM_FETCHING_STATE' });
//   })
//   .onResolution(() => {
//     store.dispatch({ type: 'NETWORK_PROBLEMS_RESOLVED' });
//   });

export default watcher;
