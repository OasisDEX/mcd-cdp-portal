import { greaterThan } from './bignumber';
import ilkList from '../references/ilkList';
import assert from 'assert';

export function getUsdPrice(ilkData) {
  // return cdp.ilkData.feedSetUSD
  //   ? cdp.ilkData.feedValueUSD.toNumber()
  //   : 0;
  return (ilkData.feedValueUSD && ilkData.feedValueUSD.toNumber()) || 0;
}

export function getLockedAndFreeCollateral(cdp) {
  const locked =
    (cdp.debt.toNumber() * (cdp.ilkData.liquidationRatio / 100)) /
    getUsdPrice(cdp.ilkData);
  const free = cdp.collateral.toNumber() - locked;

  return { locked, free };
}

export function calcCDPParams({ ilkData, gemsToLock, daiToDraw }) {
  const { liquidationRatio, debtCeiling } = ilkData;
  const collateralizationRatio = calcCollateralizationRatio({
    deposited: parseFloat(gemsToLock),
    price: getUsdPrice(ilkData),
    generated: parseFloat(daiToDraw)
  });
  const liquidationPrice = calcLiquidationPrice({
    liquidationRatio,
    deposited: parseFloat(gemsToLock),
    generated: parseFloat(daiToDraw),
    price: getUsdPrice(ilkData)
  });
  const daiAvailable = calcDaiAvailable({
    liquidationRatio,
    deposited: parseFloat(gemsToLock),
    generated: parseFloat(daiToDraw),
    price: getUsdPrice(ilkData),
    debtCeiling: parseFloat(debtCeiling)
  });

  return {
    collateralizationRatio,
    liquidationPrice,
    daiAvailable
  };
}

export function calcCollateralizationRatio({ deposited, price, generated }) {
  const value = ((deposited * price) / generated) * 100;
  return isNaN(value) ? 0 : value;
}

export function calcLiquidationPrice({
  liquidationRatio,
  deposited,
  generated
}) {
  const value = (liquidationRatio * generated) / (100 * deposited);
  return isNaN(value) ? 0 : value;
}

export function calcDaiAvailable({
  deposited,
  price,
  liquidationRatio,
  debtCeiling
}) {
  const value = deposited * price * (100 / liquidationRatio);
  const daiAvailable = isNaN(value) ? 0 : value;
  return daiAvailable >= debtCeiling ? debtCeiling : daiAvailable;
}

export function cdpParamsAreValid(
  { gemsToLock, daiToDraw },
  userGemBalance,
  ilkData
) {
  // must not open empty cdp
  if (!gemsToLock) return false; // we technically can do this, but TODO figure out if we should
  // must lock collateral in order to draw dai
  if (!!daiToDraw && !gemsToLock) return false;
  // must be positive
  if (parseFloat(daiToDraw) < 0 || parseFloat(gemsToLock) < 0) return false;
  // must have enough tokens
  if (greaterThan(gemsToLock, userGemBalance)) return false;

  const daiAvailable = calcDaiAvailable({
    deposited: parseFloat(gemsToLock),
    price: getUsdPrice(ilkData),
    liquidationRatio: parseFloat(ilkData.liquidationRatio),
    debtCeiling: parseFloat(ilkData.debtCeiling)
  });
  // must open a cdp above the liquidation threshold
  if (greaterThan(daiToDraw, daiAvailable)) return false;
  return true;
}

export function getCurrency(cdp) {
  const ilkName = cdp.ilk.name || cdp.ilk;
  const ilk = ilkList.find(i => i.key === ilkName);
  assert(ilk && ilk.currency, `could not find currency for ${ilkName}`);
  return ilk.currency;
}
