import produce from 'immer';
import setWith from 'lodash/setWith';
import {
  FEED_VALUE_USD,
  LIQUIDATION_RATIO,
  PRICE_WITH_SAFETY_MARGIN,
  DUTY,
  DEBT_CEILING,
  RATE,
  ILK_ART,
  ILK_DEBT_AVAILABLE,
  ADAPTER_BALANCE
} from './feeds';
import { SYSTEM_COLLATERALIZATION } from './system';
import { PAR } from './system';
import { getCurrency } from '../utils/cdp';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import compact from 'lodash/compact';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { USD } from '../maker';

const mathReducer = produce((draft, action) => {
  if (action.type === 'CLEAR_CONTRACT_STATE') draft.raw = {};

  if (action.type === 'watcherUpdates') {
    if (!draft.raw) draft.raw = {};

    action.payload.forEach(({ type, value }) => {
      // FIXME track down why this is happening
      if (type === 'undefined') return;

      setWith(
        draft.raw,
        type.replace(/^cdp/, 'cdps').replace(/^ilk/, 'ilks'),
        convertValue(type, value),
        Object
      );

      // here we can monitor changes to raw values that would affect
      // expensive-to-calculate derived values, and update their values as well

      if (type.startsWith('ilk')) {
        const [, name, prop] = type.split('.');

        // update the price for an ilk if `spot` or `mat` changes
        if ([PRICE_WITH_SAFETY_MARGIN, LIQUIDATION_RATIO].includes(prop)) {
          const feed = draft.feeds.find(f => f.key === name);
          feed[FEED_VALUE_USD] = recalculatePrice(
            draft.raw.ilks[name],
            name,
            draft.system[PAR]
          );
        }
        // update the debt available for an ilk if `rate`, `art` or `line` changes
        if ([RATE, ILK_ART, DEBT_CEILING].includes(prop)) {
          const feed = draft.feeds.find(f => f.key === name);
          const { ilkArt, rate, debtCeiling } = draft.raw.ilks[name];
          if (ilkArt && rate && debtCeiling) {
            feed[ILK_DEBT_AVAILABLE] = calculateDebtAvailable(
              ilkArt,
              rate,
              debtCeiling
            );
          }
        }
        // update the system collateralization if Art, rate, adapterBalance, spot, or mat changes for any ilk
        if (
          [
            RATE,
            ILK_ART,
            ADAPTER_BALANCE,
            PRICE_WITH_SAFETY_MARGIN,
            LIQUIDATION_RATIO
          ].includes(prop)
        ) {
          const debts = draft.feeds.map(feed => {
            if (!draft.raw.ilks[feed.key]) return;
            const { ilkArt, rate } = draft.raw.ilks[feed.key];
            if (ilkArt && rate) {
              return math.debtValue(ilkArt, rate);
            }
          });
          const combinedDebt = compact(debts).reduce(
            (a, b) => a.plus(b),
            MDAI(0)
          );
          const colVals = draft.feeds.map(feed => {
            if (!draft.raw.ilks[feed.key]) return;
            const { adapterBalance } = draft.raw.ilks[feed.key];
            const par = draft.system ? draft.system[PAR] : null;
            const price = recalculatePrice(
              draft.raw.ilks[feed.key],
              feed.key,
              par
            );
            if (adapterBalance && price) {
              return math.collateralValue(
                math.collateralAmount(
                  getCurrency({ ilk: feed.key }),
                  adapterBalance
                ),
                price
              );
            }
          });
          const combinedColVal = compact(colVals).reduce(
            (a, b) => a.plus(b),
            USD(0)
          );
          if (
            math.collateralizationRatio(combinedColVal, combinedDebt) ===
            Infinity
          ) {
            draft.system[SYSTEM_COLLATERALIZATION] = Infinity;
          } else {
            draft.system[
              SYSTEM_COLLATERALIZATION
            ] = math
              .collateralizationRatio(combinedColVal, combinedDebt)
              .times(100);
          }
        }
      }
      // if `par` changes (which is unlikely) all the prices need to change
      if (type === `system.${PAR}` && draft.raw.ilks) {
        draft.feeds.forEach(feed => {
          feed[FEED_VALUE_USD] = recalculatePrice(
            draft.raw.ilks[feed.key],
            feed.key,
            value
          );
        });
      }
    });
  }
});

export default mathReducer;

// some values can be immediately converted to a human-readable form because
// their raw value is never used in calculations
function convertValue(type, value) {
  const [label, ...others] = type.split('.');
  if (label === 'ilk') {
    const valueType = others[1];
    switch (valueType) {
      case LIQUIDATION_RATIO:
        return math.liquidationRatio(value);
      case DUTY:
        return math.annualStabilityFee(value);
      default:
      // fall through to final return
    }
  }
  return value;
}

function recalculatePrice(ilk, name, par) {
  if (
    !ilk ||
    !ilk[PRICE_WITH_SAFETY_MARGIN] ||
    !ilk[LIQUIDATION_RATIO] ||
    !par
  ) {
    return;
  }

  const price = math.price(
    getCurrency({ ilk: name }),
    par,
    ilk[PRICE_WITH_SAFETY_MARGIN],
    ilk[LIQUIDATION_RATIO]
  );
  console.log(`calculated price for ${name}: ${price}`);
  return price;
}

function calculateDebtAvailable(art, rate, line) {
  const debtValue = math.debtValue(art, rate);
  const debtCeiling = math.debtCeiling(line);
  return debtCeiling.minus(debtValue);
}
