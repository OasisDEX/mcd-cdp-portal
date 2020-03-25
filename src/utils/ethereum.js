import round from 'lodash/round';
import { ETH, BAT } from '../maker';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

export function padRight(string, chars, sign) {
  return string + new Array(chars - string.length + 1).join(sign ? sign : '0');
}

export function toHex(str, { with0x = true, rightPadding = 64 } = {}) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  if (rightPadding > 0) result = padRight(result, rightPadding);
  return with0x ? '0x' + result : result;
}

export function addressAsNumber(address) {
  return parseInt(address.slice(2, 10), 16);
}

export function isMissingContractAddress(call) {
  if (call.target === undefined) {
    console.error(`Address for ${call.call} not found`);
    return true;
  }
  return false;
}

export const toNum = async promise => {
  const val = await promise;
  return val.toBigNumber().toFixed();
};

//TODO add new token here (its for hardware wallet)
export const addTokenBalances = async account => {
  return {
    ...account,
    ethBalance: round(
      await toNum(window.maker.getToken(ETH).balanceOf(account.address)),
      2
    ),
    batBalance: round(
      await toNum(window.maker.getToken(BAT).balanceOf(account.address)),
      2
    )
  };
};

export const isValidAddressString = addressString =>
  /^0x([A-Fa-f0-9]{40})$/.test(addressString);

export const isValidTxString = txString =>
  /^0x([A-Fa-f0-9]{64})$/.test(txString);

export const etherscanLink = (string, network = 'mainnet') => {
  const pathPrefix = network === 'mainnet' ? '' : `${network}.`;
  if (isValidAddressString(string))
    return `https://${pathPrefix}etherscan.io/address/${string}`;
  else if (isValidTxString(string))
    return `https://${pathPrefix}etherscan.io/tx/${string}`;
  else throw new Error(`Can't create Etherscan link for "${string}"`);
};

export async function checkEthereumProvider() {
  let provider;
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.enable();
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else {
    throw new Error('No web3 provider detected');
  }

  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  const address = (await web3.eth.getAccounts())[0];

  return { networkId, address };
}

export async function browserEthereumProviderAddress() {
  let provider;
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else return null;
  if (
    provider.selectedAddress &&
    typeof provider.selectedAddress === 'string'
  ) {
    return provider.selectedAddress.toLowerCase();
  }
  const addresses = await new Web3(provider).eth.getAccounts();
  return addresses.length > 0 ? addresses[0].toLowerCase() : null;
}

export async function isEthereumProviderApproved() {
  let provider;
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else return false;
  if (provider.selectedAddress) return true;
  const addresses = await new Web3(provider).eth.getAccounts();
  return addresses.length > 0 ? true : false;
}

export const calculateGasCost = async (maker, gasLimit = 21000) => {
  const _gasLimit = BigNumber(gasLimit);
  const gasPrice = await maker.service('gas').getGasPrice('fast');
  return _gasLimit.times(gasPrice).shiftedBy(-18);
};
