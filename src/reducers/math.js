import produce from 'immer';
import setWith from 'lodash/setWith';

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
        value,
        Object
      );

      // TODO: this is where we could notice changes in raw values that would
      // cause changes in expensive-to-calculate derived values, and update
      // their values as well
    });
  }
});

export default mathReducer;
