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

export function isMissingContractAddress(calldata) {
  if (calldata.target === undefined) {
    console.error(`Address for ${calldata.call} not found`);
    return true;
  }
  return false;
}

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
