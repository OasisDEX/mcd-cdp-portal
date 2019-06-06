import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import ilkList from '../references/ilkList';
import assert from 'assert';

export function getUsdPrice(ilkData) {
  // return cdp.ilkData.feedSetUSD
  //   ? cdp.ilkData.price.toNumber()
  //   : 0;
  return (ilkData.price && ilkData.price.toNumber()) || 0;
}

export function calcCDPParams({
  liquidationRatio,
  price,
  gemsToLock,
  daiToDraw
}) {
  const collateralValue = gemsToLock.times(price);

  return {
    collateralizationRatio: math.collateralizationRatio(
      collateralValue,
      daiToDraw
    ),
    liquidationPrice: math.liquidationPrice(
      gemsToLock,
      daiToDraw,
      liquidationRatio
    ),
    daiAvailable: math.daiAvailable(
      collateralValue,
      daiToDraw,
      liquidationRatio
    )
  };
}

export function getCurrency(cdp) {
  const ilkName = cdp.ilk.name || cdp.ilk;
  const ilk = ilkList.find(i => i.key === ilkName);
  assert(ilk && ilk.currency, `could not find currency for ${ilkName}`);
  return ilk.currency;
}
