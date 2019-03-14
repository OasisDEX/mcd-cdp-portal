export function prettifyNumber(_num = null, truncate = false) {
  if (_num === null) return null;
  let symbol = ' ';
  if (_num.symbol !== undefined) symbol += _num.symbol;
  const num = parseFloat(_num.toString());
  if (num > Number.MAX_SAFE_INTEGER)
    throw new Error(
      `formatNumber is not meant to be used with very large numbers`
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
