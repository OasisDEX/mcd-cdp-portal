import assert from 'assert';
import useStore from 'hooks/useStore';
import { getCdp } from 'reducers/cdps';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';

export default function useCdp(cdpId) {
  assert(cdpId, 'a cdp id must be provided to useCdp');

  const [storeState] = useStore();

  const { ink, art } = storeState.raw.cdps[cdpId];
  const { currency, ilk, dust } = getCdp(cdpId, storeState);
  const { rate, liquidationRatio, priceWithSafetyMargin } = storeState.raw.ilks[
    ilk
  ];
  const { par } = storeState.raw.system;

  const price = math.price(
    currency,
    par,
    priceWithSafetyMargin,
    liquidationRatio
  );
  const collateralAmount = math.collateralAmount(currency, ink);
  const collateralValue = math.collateralValue(collateralAmount, price);
  const debtValue = math.debtValue(art, rate);

  const liquidationPrice = ({ dart = 0 } = {}) => {
    return math.liquidationPrice(
      collateralAmount,
      debtValue.plus(dart),
      liquidationRatio
    );
  };

  const daiAvailable = () => {
    return math.daiAvailable(collateralValue, debtValue, liquidationRatio);
  };

  const collateralizationRatio = ({ dart = 0 } = {}) => {
    return math.collateralizationRatio(collateralValue, debtValue.plus(dart));
  };

  //   todo: what about the 0 case
  return {
    ilk,
    dust,
    debtValue,
    liquidationRatio,
    daiAvailable,
    liquidationPrice,
    collateralizationRatio
  };
}
