import { enableBatching } from 'utils/redux';
import produce from 'immer';
import setWith from 'lodash/setWith';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import ilkList from '../references/ilkList';
import { SPOT, LIQUIDATION_RATIO, FEED_VALUE_USD } from './feeds';
import each from 'lodash/each';

const initialState = { system: {}, urns: {}, ilks: {} };

const rootReducer = produce((draft, action) => {
  if (action.type === 'CLEAR_CONTRACT_STATE') return initialState;

  if (action.type === 'watcherUpdates') {
    action.payload.forEach(({ type, value }) => {
      // FIXME track down why this is happening
      if (type === 'undefined') return;

      // lodash.setWith creates nested objects from dotted paths
      setWith(
        draft,
        type.replace(/^urn/, 'urns').replace(/^ilk/, 'ilks'),
        value,
        Object
      );

      if (type.startsWith('ilk')) {
        const [, name, prop] = type.split('.');
        const ilk = draft.ilks[name];

        if (prop === 'duty') {
          ilk.stabilityFee = math.annualStabilityFee(value);
        }

        if ([SPOT, LIQUIDATION_RATIO].includes(prop))
          recalculatePrice(ilk, name, draft.system.par);
      }

      if (type === 'system.par') {
        each(draft.ilks, (ilk, name) => recalculatePrice(ilk, name, value));
      }
    });
  }
}, initialState);

function recalculatePrice(ilk, name, par) {
  if (![SPOT, LIQUIDATION_RATIO].every(f => ilk[f]) || !par) return;

  const { currency } = ilkList.find(i => i.key === name);

  ilk[FEED_VALUE_USD] = math.price(
    currency,
    par,
    ilk[SPOT],
    ilk[LIQUIDATION_RATIO]
  );

  if (!ilk.gem) ilk.gem = currency.symbol;

  console.log(`set new ${name} price: ${ilk[FEED_VALUE_USD]}`);
}

export default enableBatching(rootReducer);
