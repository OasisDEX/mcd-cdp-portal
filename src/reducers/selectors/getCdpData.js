import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import { Currency } from '@makerdao/currency';
import ilkList from '../../references/ilkList';
import mapValues from 'lodash/mapValues';

export default function getCdpData(id, store, formatted) {
  if (!store.urns || !store.ilks) return null;
  const cdp = store.urns[id.toString()];
  if (!cdp || !cdp.ink) return null;
  const ilk = store.ilks[cdp.ilk];
  if (!ilk || !ilk.price) return null;

  const { liquidationRatio, rate, price } = ilk;
  const currency = ilkList.find(i => i.key === cdp.ilk).currency;
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
    ilk: {
      ...ilk,
      name: cdp.ilk
    },
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

export function formatValue(value, key) {
  if (!value && value !== 0) return '';

  switch (key) {
    case 'stabilityFee':
      return (value * 100).toFixed(1);
    case 'collateralizationRatio':
    case 'liquidationRatio':
      return (value.toNumber() * 100).toFixed(2);
    case 'liquidationPenalty':
      return (value * 100).toFixed(0);
    default: // do nothing
  }

  if (value instanceof Currency) {
    const newValue = value.toNumber().toFixed(2);
    return newValue;
  }

  return value;
}
