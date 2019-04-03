export function getUsdPrice(ilkData) {
  // return cdp.ilkData.feedSetUSD
  //   ? cdp.ilkData.feedValueUSD.toNumber()
  //   : 0;
  console.log(ilkData.feedValueUSD);
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
  const { liquidationRatio } = ilkData;
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
    price: getUsdPrice(ilkData)
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

export function calcDaiAvailable({ deposited, price, liquidationRatio }) {
  const value = deposited * price * (100 / liquidationRatio);
  return isNaN(value) ? 0 : value;
}
