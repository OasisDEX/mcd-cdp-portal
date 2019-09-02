import { fromWei } from 'utils/units';

export function accountBalanceForToken(addresses, token, currentAddress) {
  return [
    {
      target: addresses[token],
      call: ['balanceOf(address)(uint256)', currentAddress],
      returns: [[`accounts.${currentAddress}.balances.${token}`, fromWei]]
    }
  ];
}

export default function(addresses, currentAddress, proxyAddress) {
  return [
    {
      target: addresses.MCD_POT,
      call: ['pie(address)(uint256)', proxyAddress],
      returns: [[`accounts.${currentAddress}.savings`, fromWei]]
    }
  ];
}
