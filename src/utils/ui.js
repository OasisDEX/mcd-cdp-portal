export function prettifyNumber(_num = null, truncate = false) {
  if (_num === null) return null;
  let symbol = ' ';
  if (_num.symbol !== undefined) symbol += _num.symbol;
  const num = parseFloat(_num.toString());
  if (num > Number.MAX_SAFE_INTEGER)
    throw new Error(
      'formatNumber is not meant to be used with very large numbers'
    );
  let formattedNumber;
  if (truncate) {
    if (num > 999999) formattedNumber = (num / 1000000).toFixed(1) + ' M';
    else if (num > 999) formattedNumber = (num / 1000).toFixed(1) + ' K';
    else formattedNumber = num.toFixed(2);
  } else {
    formattedNumber = num.toLocaleString();
  }
  return formattedNumber + symbol;
}

export function cutMiddle(str = '', left = 4, right = 4) {
  if (str.length <= left + right) return str;
  return `${str.slice(0, left)}...${str.slice(-right)}`;
}

export function calcCDPParams({ ilkData, gemsToLock, daiToDraw }) {
  const { liquidationRatio } = ilkData;
  const collateralizationRatio =
    calcCollateralizationRatio({
      deposited: parseFloat(gemsToLock),
      price: getUsdPrice(ilkData),
      generated: parseFloat(daiToDraw)
    }) || 0;
  const liquidationPrice =
    calcLiquidationPrice({
      liquidationRatio,
      deposited: parseFloat(gemsToLock),
      generated: parseFloat(daiToDraw),
      price: getUsdPrice(ilkData)
    }) || 0;
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
  return isNaN(value) ? 0 : value.toFixed(2);
}

export function calcLiquidationPrice({
  liquidationRatio,
  deposited,
  generated
}) {
  const value = (liquidationRatio * generated) / (100 * deposited);
  return isNaN(value) ? 0 : value.toFixed(2);
}

export function calcDaiAvailable({ deposited, price, liquidationRatio }) {
  const value = deposited * price * (100 / liquidationRatio);
  return isNaN(value) ? 0 : value.toFixed(2);
}

export function getUsdPrice(ilkData) {
  return parseFloat(ilkData.feedValueUSD.toString());
}

export function cdpParamsAreValid({ gemsToLock, daiToDraw }, userGemBalance) {
  if (parseFloat(gemsToLock) > parseFloat(userGemBalance)) return false;
  return !!gemsToLock && !!daiToDraw;
}
