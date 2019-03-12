import round from 'lodash.round';
import { MKR, ETH } from 'maker';

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

export const toNum = async promise => {
  const val = await promise;
  return val.toBigNumber().toFixed();
};

export const addMkrAndEthBalance = async account => {
  return {
    ...account,
    ethBalance: round(
      await toNum(window.maker.getToken(ETH).balanceOf(account.address)),
      3
    ),
    mkrBalance: round(
      await toNum(window.maker.getToken(MKR).balanceOf(account.address)),
      3
    )
  };
};
