import round from 'lodash/round';
import { MKR, ETH } from './maker';

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

export async function checkEthereumProvider() {
  return new Promise(async (resolve, reject) => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const { selectedAddress, networkVersion } = window.ethereum;
      resolve({
        networkId: parseInt(networkVersion, 10),
        address: selectedAddress
      });
    } else reject(new Error('No web3 provider detected'));
  });
}
