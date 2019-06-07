import round from 'lodash/round';
import { Currency } from '@makerdao/currency';

export function formatCollateralizationRatio(ratio) {
  if (ratio === Infinity) {
    return 'Infinity';
  } else if (isNaN(ratio)) {
    return '---';
  } else {
    if (ratio < 0) ratio = 0;
    return `${ratio.toFixed(2)}%`;
  }
}

export function formatLiquidationPrice(price, symbol) {
  if (price < 0) price = 0;
  return `${round(price, 2).toLocaleString()} ${symbol}/USD`;
}

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
