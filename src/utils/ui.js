import round from 'lodash/round';
import lang from 'languages';

export function formatCollateralizationRatio(ratio) {
  if (ratio === Infinity) {
    return lang.cdp_page.not_applicable;
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

export function prettifyNumber(
  _num = null,
  truncate = false,
  decimalPlaces = 2,
  keepSymbol = true
) {
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
    else formattedNumber = num.toFixed(decimalPlaces);
  } else {
    formattedNumber = num.toLocaleString();
  }
  return keepSymbol ? formattedNumber + symbol : formattedNumber;
}

export function prettifyFloat(num, decimalPlaces = 2) {
  if (!num) return 'NaN';
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
  if (s === 'MDAI') return 'DAI';
  return s;
}

export const actionToText = {
  lock: lang.actions_past_tense.deposit,
  free: lang.actions_past_tense.withdraw,
  wipe: lang.actions_past_tense.pay_back,
  draw: lang.actions_past_tense.generate
};

export function activityString(action, amount, lowercase) {
  const and = lowercase ? ' and ' : '';
  const formattedAction = lowercase
    ? firstLetterLowercase(actionToText[action])
    : actionToText[action];
  return (
    and +
    formattedAction +
    ' ' +
    prettifyNumber(amount.toNumber()) +
    cleanSymbol(amount.symbol)
  );
}

function auctionString(amount) {
  return (
    prettifyNumber(amount.toNumber()) +
    amount.symbol +
    ' ' +
    lang.returned_auction
  );
}

export function fullActivityString(e) {
  if (e.liquidated) return lang.liquidated_event;
  if (e.auctionProceeds) return auctionString(e.changeInCollateral);
  let str = '';
  if (e.collateralAction)
    str += activityString(e.collateralAction, e.changeInCollateral);
  if (e.daiAction)
    str += activityString(e.daiAction, e.changeInDai, e.collateralAction);
  return str;
}

export function formatDate(d) {
  return d.toLocaleDateString(lang.getInterfaceLanguage(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
