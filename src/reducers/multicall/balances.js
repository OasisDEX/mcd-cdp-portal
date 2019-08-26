import BigNumber from 'bignumber.js';

export default function(addresses, token, currentAddress) {
  return [
    {
      target: addresses[token],
      call: ['balanceOf(address)(uint256)', currentAddress],
      returns: [
        [
          `balance.${currentAddress}.${token}`,
          amt => new BigNumber(amt).shiftedBy(-18)
        ]
      ]
    }
  ];
}
