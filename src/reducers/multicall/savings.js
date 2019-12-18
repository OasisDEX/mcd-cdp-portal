import { fromWei, fromRad, fromRay } from 'utils/units';

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

export default function(addresses) {
  return [
    {
      target: addresses.MCD_POT,
      call: ['Pie()(uint256)'],
      returns: [['savings.Pie', fromWei]]
    },
    {
      target: addresses.MCD_POT,
      call: ['dsr()(uint256)'],
      returns: [
        [
          'savings.yearlyRate',
          rate =>
            fromRay(rate)
              .pow(SECONDS_PER_YEAR)
              .minus(1)
              .times(100)
        ]
      ]
    },
    {
      target: addresses.MCD_VAT,
      call: ['dai(address)(uint256)', addresses.MCD_POT],
      returns: [['savings.totalDai', fromRad]]
    },
    {
      target: addresses.MCD_POT,
      call: ['dsr()(uint256)'],
      returns: [['savings.dsr', fromRay]]
    }
  ];
}
