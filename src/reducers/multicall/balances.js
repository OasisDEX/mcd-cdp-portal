export default function(addresses, currency, currentAddress) {
  return [
    {
      target: addresses[currency.symbol],
      call: ['balanceOf(address)(uint256)', currentAddress],
      returns: [
        [
          `balance.${currentAddress}.${currency.symbol}`,
          amt => currency.wei(amt)
        ]
      ]
    }
  ];
}
