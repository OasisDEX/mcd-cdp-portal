import produce from 'immer';

const mathReducer = produce(draft => {
  if (!draft.raw) draft.raw = {};
});

export default mathReducer;
