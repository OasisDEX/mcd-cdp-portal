import { greaterThanOrEqual } from './bignumber';

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

export const copyToClipboard = string => {
  const textArea = document.createElement('textarea');
  textArea.value = string;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('Copy');
  textArea.remove();
};

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
  return parseFloat(ilkData.feedValueUSD.toString()) || '---';
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
  if (greaterThanOrEqual(gemsToLock, userGemBalance)) return false;

  const daiAvailable = calcDaiAvailable({
    gemsToLock: parseFloat(gemsToLock),
    price: getUsdPrice(ilkData),
    liquidationRatio: parseFloat(ilkData.liquidationRatio)
  });
  // must open a cdp above the liquidation threshold
  if (greaterThanOrEqual(daiAvailable, daiToDraw)) return false;
  return true;
}

export function getUnique(arr, comp) {
  return arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e])
    .map(e => arr[e]);
}
