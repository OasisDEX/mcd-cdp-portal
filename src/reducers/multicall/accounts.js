import { fromWei, MAX_UINT_BN } from 'utils/units';

export function accountBalanceForToken(
  addresses,
  tokenSymbol,
  currentAddress,
  proxyAddress
) {
  return [
    {
      target: addresses[tokenSymbol],
      call: ['balanceOf(address)(uint256)', currentAddress],
      returns: [[`accounts.${currentAddress}.balances.${tokenSymbol}`, fromWei]]
    },
    ...(proxyAddress
      ? [
          {
            target: addresses[tokenSymbol],
            call: [
              'allowance(address,address)(uint256)',
              currentAddress,
              proxyAddress
            ],
            returns: [
              [
                `accounts.${currentAddress}.allowances.${tokenSymbol}`,
                allowance => fromWei(allowance).eq(MAX_UINT_BN)
              ]
            ]
          }
        ]
      : [])
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
