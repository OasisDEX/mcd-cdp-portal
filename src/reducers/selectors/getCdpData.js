import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import mapValues from 'lodash/mapValues';
import getIlkData from './getIlkData';
import { formatValue } from '../../utils/ui';

export default function getCdpData(id, store, formatted) {
  if (!store.urns || !store.ilks) return null;
  const cdp = store.urns[id.toString()];
  if (!cdp || !cdp.ink) return null;
  const ilk = getIlkData(cdp.ilk, store);
  if (!ilk) return null;

  const { liquidationRatio, rate, price, currency } = ilk;
  const collateralAmount = math.collateralAmount(currency, cdp.ink);
  const collateralValue = math.collateralValue(collateralAmount, price);
  const debtValue = math.debtValue(cdp.art, rate);
  const collateralizationRatio = math.collateralizationRatio(
    collateralValue,
    debtValue
  );
  const minSafeCollateralAmount = math.minSafeCollateralAmount(
    debtValue,
    liquidationRatio,
    price
  );
  const liquidationPrice = math.liquidationPrice(
    collateralAmount,
    debtValue,
    liquidationRatio
  );
  const collateralAvailableAmount = collateralAmount.minus(
    minSafeCollateralAmount
  );
  const collateralAvailableValue = collateralAvailableAmount.times(price);
  const daiAvailable = math.daiAvailable(
    collateralValue,
    debtValue,
    liquidationRatio
  );
  const result = {
    ...cdp,
    ilk,
    gem: currency.symbol,
    collateralAmount,
    collateralValue,
    collateralAvailableAmount,
    collateralAvailableValue,
    collateralizationRatio,
    daiAvailable,
    debtValue,
    liquidationPrice,
    minSafeCollateralAmount
  };

  return formatted ? formatValues(result) : result;
}

function formatValues(data) {
  return mapValues(data, (value, key) =>
    key === 'ilk' ? formatValues(value) : formatValue(value, key)
  );
}
