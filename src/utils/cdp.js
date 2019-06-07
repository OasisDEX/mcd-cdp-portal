import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import ilkList from '../references/ilkList';
import assert from 'assert';
import { greaterThan } from './bignumber';
import { liquidationPrice } from '@makerdao/dai-plugin-mcd/dist/math';
import { MDAI } from '@makerdao/dai-plugin-mcd';

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

export function cdpParamsAreValid(
  { gemsToLock, daiToDraw },
  userGemBalance,
  ilk
) {
  // must not open empty cdp
  // we technically can do this, but TODO figure out if we should
  if (!gemsToLock) return false;
  // must lock collateral in order to draw dai
  if (!!daiToDraw && !gemsToLock) return false;
  // must be positive
  if (parseFloat(daiToDraw) < 0 || parseFloat(gemsToLock) < 0) return false;
  // must have enough tokens
  if (greaterThan(gemsToLock, userGemBalance)) return false;

  const safePrice = liquidationPrice(
    ilk.currency(gemsToLock),
    MDAI(daiToDraw),
    ilk.liquidationRatio
  );

  console.log(safePrice.toString(), ilk.price.toString());
  return ilk.price.gt(safePrice);
}
