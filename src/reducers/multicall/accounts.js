import { fromWei, MAX_UINT_BN } from 'utils/units';

export function accountAllowanceForToken(
  addresses,
  tokenSymbol,
  currentAddress,
  proxyAddress
) {
  return [
    ...[
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
            // Unlimited allowance may be a tiny bit less than MAX_UINT_BN,
            // calling .toNumber() gives us a reasonably large number to compare.
            allowance =>
              fromWei(allowance).toNumber() === MAX_UINT_BN.toNumber()
          ]
        ]
      }
    ]
  ];
}

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
      ? accountAllowanceForToken(
          addresses,
          tokenSymbol,
          currentAddress,
          proxyAddress
        )
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
