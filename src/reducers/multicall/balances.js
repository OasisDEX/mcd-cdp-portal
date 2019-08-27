import { fromWei } from 'utils/units';

export default function(addresses, token, currentAddress) {
  return [
    {
      target: addresses[token],
      call: ['balanceOf(address)(uint256)', currentAddress],
      returns: [[`balance.${currentAddress}.${token}`, fromWei]]
    }
  ];
}
