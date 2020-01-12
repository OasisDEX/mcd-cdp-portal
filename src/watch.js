import ilks from './references/ilkList';
import { createCDPSystemModel } from './reducers/multicall/system';
import cdpTypeModel from './reducers/multicall/feeds';
import {
  accountSavings,
  accountBalanceForToken,
  accountProxyAllowanceForToken
} from './reducers/multicall/accounts';
import { tokensWithBalances } from 'reducers/accounts';
import savingsModel from './reducers/multicall/savings';
import { isMissingContractAddress } from './utils/ethereum';
import flatten from 'lodash/flatten';
import { mcdSchema } from '@makerdao/dai-plugin-mcd';
let watcher;

// Update watcher calls with new address for tracking token balances, proxy allowances and savings
export function updateWatcherWithAccount(maker, accountAddress, proxyAddress) {
  const addresses = maker.service('smartContract').getContractAddresses();
  addresses.MDAI = addresses.MCD_DAI;
  addresses.MWETH = addresses.ETH;

  maker.service('multicall').tap(calls =>
    [
      // Filter out existing calls of the same types we're about to add
      ...calls.filter(
        call =>
          !(
            (accountAddress && call?.meta?.accountBalanceForToken) ||
            (accountAddress &&
              proxyAddress &&
              (call?.meta?.accountSavings ||
                call?.meta?.accountProxyAllowanceForToken))
          )
      ),
      // Add account balance calls
      ...(accountAddress
        ? flatten(
            tokensWithBalances
              .filter(token => token !== 'DSR')
              .map(token =>
                accountBalanceForToken(addresses, token, accountAddress)
              )
          )
        : []),
      // Add account savings and proxy allowance calls
      ...(accountAddress && proxyAddress
        ? [
            ...accountSavings(addresses, accountAddress, proxyAddress),
            ...flatten(
              tokensWithBalances
                // ETH/DSR can't have an allowance
                .filter(token => token !== 'ETH' && token !== 'DSR')
                .map(token =>
                  accountProxyAllowanceForToken(
                    addresses,
                    token,
                    accountAddress,
                    proxyAddress
                  )
                )
            )
          ]
        : [])
    ].filter(call => !isMissingContractAddress(call))
  );
}

// Update watcher calls for tracking proxy allowances
export async function updateWatcherWithProxy(
  maker,
  accountAddress,
  proxyAddress
) {
  const addresses = maker.service('smartContract').getContractAddresses();
  addresses.MDAI = addresses.MCD_DAI;
  addresses.MWETH = addresses.ETH;

  maker.service('multicall').tap(calls =>
    [
      ...calls,
      ...(accountAddress && proxyAddress
        ? flatten(
            tokensWithBalances
              // ETH/DSR can't have an allowance
              .filter(token => token !== 'ETH' && token !== 'DSR')
              .map(token =>
                accountProxyAllowanceForToken(
                  addresses,
                  token,
                  accountAddress,
                  proxyAddress
                )
              )
          )
        : [])
    ].filter(call => !isMissingContractAddress(call))
  );
}

export function createWatcher(maker) {
  const service = maker.service('multicall');
  service.createWatcher({ interval: 'block' });
  watcher = service.watcher;
  window.watcher = watcher;
  return watcher;
}

export async function startWatcher(maker) {
  const addresses = maker.service('smartContract').getContractAddresses();
  // Add additional lookups for easier mapping when finding address by token symbol
  addresses.MDAI = addresses.MCD_DAI;
  addresses.MWETH = addresses.ETH;

  // Add initial calls to watcher
  maker
    .service('multicall')
    .tap(calls =>
      [
        ...calls,
        ...createCDPSystemModel(addresses),
        ...flatten(ilks.map(ilk => cdpTypeModel(addresses, ilk))),
        ...savingsModel(addresses)
      ].filter(call => !isMissingContractAddress(call))
    );

  maker
    .service('multicall')
    .registerSchemas([
      ...flatten(ilks.map(({ key: ilkName }) => mcdSchema.ilk(ilkName)))
    ]);

  // Our watch has begun
  maker.service('multicall').start();
  maker.service('multicall').startObservable();

  return watcher;
}

export function getWatcher() {
  return watcher;
}
