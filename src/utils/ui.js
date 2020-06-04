import React from 'react';
import round from 'lodash/round';
import BigNumber from 'bignumber.js';
import lang from 'languages';
import { Currency } from '@makerdao/currency';
import { decimalRules } from '../styles/constants';
const { short, medium } = decimalRules;

export function formatCollateralizationRatio(ratio) {
  if (ratio === Infinity) return lang.cdp_page.not_applicable;
  if (isNaN(ratio)) return '---';
  if (ratio < 0) ratio = 0;
  return `${ratio.toFixed(2)}%`;
}

export function formatLiquidationPrice(price, symbol) {
  if (price < 0) price = 0;
  return `${round(price, 2).toLocaleString()} ${symbol}/USD`;
}

function getSeparator(locale, separatorType) {
  const numberWithGroupAndDecimalSeparator = 1000.1;
  const numFormat = Intl.NumberFormat(locale);
  return numFormat.formatToParts
    ? numFormat
        .formatToParts(numberWithGroupAndDecimalSeparator)
        .find(part => part.type === separatorType)?.value
    : null;
}

export function prettifyCurrency(locale, num = null, decimalPlaces = null) {
  if (num === null) return null;
  if (decimalPlaces && num < 1) decimalPlaces = 4;
  return new BigNumber(num).toFormat(decimalPlaces, BigNumber.ROUND_CEIL, {
    decimalSeparator: getSeparator(locale, 'decimal') || '.',
    groupSeparator: getSeparator(locale, 'group'),
    groupSize: 3
  });
}

export function prettifyNumber(
  _num = null,
  truncate = false,
  decimalPlaces = 2,
  keepSymbol = true
) {
  if (_num === null) return null;
  let symbol = '';
  if (_num.symbol !== undefined) symbol += ' ' + cleanSymbol(_num.symbol);
  const num = parseFloat(_num.toString());
  if (num > Number.MAX_SAFE_INTEGER) return 'NUMBER TOO BIG';
  let formattedNumber;
  if (truncate) {
    if (num > 999999999999) formattedNumber = (num / 1000000).toFixed(1) + 'T';
    if (num > 999999999) formattedNumber = (num / 1000000).toFixed(1) + 'B';
    if (num > 999999) formattedNumber = (num / 1000000).toFixed(1) + 'M';
    else if (num > 999) formattedNumber = (num / 1000).toFixed(1) + 'K';
    else if (num < 1) formattedNumber = num.toFixed(4);
    else formattedNumber = num.toFixed(decimalPlaces);
  } else {
    formattedNumber = num.toLocaleString();
  }
  return keepSymbol ? formattedNumber + symbol : formattedNumber;
}

export function prettifyFloat(num, decimalPlaces = 2) {
  if (!num && num !== 0) return 'NaN';
  const [, decimalPortion] = num.toString().split('.');
  const decimalPlacesInNumber = decimalPortion ? decimalPortion.length : 0;

  return decimalPlacesInNumber > decimalPlaces
    ? `${num.toFixed(decimalPlaces)}...`
    : num;
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

export function firstLetterLowercase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function cleanSymbol(s) {
  if (s === 'DSR-DAI') return 'DAI';
  return s;
}

export const shortenAddress = address =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export function formatEventDescription(lang, e) {
  const interfaceLocale = lang.getInterfaceLanguage();
  switch (e.type) {
    case 'OPEN':
      return lang.formatString(lang.event_history.open, <b>{e.id}</b>);
    case 'DEPOSIT':
      return lang.formatString(
        lang.event_history.deposit,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>,
        e.gem
      );
    case 'RECLAIM':
      return lang.formatString(
        lang.event_history.reclaim,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>,
        e.gem
      );
    case 'DSR_DEPOSIT':
      return lang.formatString(
        lang.event_history.dsr_deposit,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>,
        e.gem
      );
    case 'DSR_WITHDRAW':
      return lang.formatString(
        lang.event_history.dsr_withdraw,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>,
        e.gem
      );
    case 'WITHDRAW':
      return lang.formatString(
        lang.event_history.withdraw,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>,
        e.gem
      );
    case 'GENERATE':
      return lang.formatString(
        lang.event_history.generate,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>
      );
    case 'PAY_BACK':
      return lang.formatString(
        lang.event_history.pay_back,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>
      );
    case 'GIVE':
      return lang.formatString(
        lang.event_history.give,
        <b>{shortenAddress(e.newOwner)}</b>,
        <b>{shortenAddress(e.prevOwner)}</b>
      );
    case 'MIGRATE':
      return lang.formatString(lang.event_history.migrate);
    case 'BITE':
      return lang.formatString(
        lang.event_history.bite,
        <b>{prettifyCurrency(interfaceLocale, e.amount, 2)}</b>,
        e.gem
      );
    default:
      return '?';
  }
}

export function formatDate(d) {
  return (
    d.toLocaleDateString(lang.getInterfaceLanguage(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) +
    ', ' +
    d.toLocaleTimeString(lang.getInterfaceLanguage())
  );
}

// ensures a result < amount.toFixed(d)
export function safeToFixed(amount, digits) {
  if (typeof amount === 'string') amount = parseFloat(amount);
  const s = amount.toFixed(digits);
  return s.substring(0, s.length - 1);
}

export function formatPrecision(amount, precision = 4) {
  return amount < 1 ? 4 : precision;
}

export const formatCurrencyValue = ({
  value,
  precision = short,
  percentage = false,
  integer = false,
  infinity = 'N/A',
  rounding = BigNumber.ROUND_DOWN
}) => {
  if (value instanceof Currency) value = value.toBigNumber();
  else if (!BigNumber.isBigNumber(value)) value = BigNumber(value);
  if (['Infinity', Infinity].includes(value.toFixed(precision)))
    return infinity;
  if (percentage) value = value.times(100);
  if (integer) value = value.integerValue(BigNumber.ROUND_HALF_UP);
  if (value.lt(1) && rounding === BigNumber.ROUND_DOWN) precision = medium;
  return value.toFixed(precision, rounding);
};

export function formatter(target, options = {}) {
  return formatCurrencyValue({ value: target, ...options });
}
