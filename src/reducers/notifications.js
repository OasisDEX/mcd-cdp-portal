import produce from 'immer';

export const RESET_NOTIFICATIONS = 'resetAllNotifications';
export const ADD_NOTIFICATION = 'addNotification';
export const DELETE_NOTIFICATION = 'deleteNotification';

const initialState = {
  banners: {},
  viewable: true
};

function addNotification(state, payload) {
  const [[_, id], ...rest] = Object.entries(payload);
  return {
    ...state,
    banners: {
      ...state.banners,
      [id]: rest.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
    }
  };
}

const reducer = produce((draft, { type, action, payload }) => {
  if (!type) return;
  if (type === 'notifications') {
    switch (action) {
      case RESET_NOTIFICATIONS:
        return initialState;
      case ADD_NOTIFICATION:
        return addNotification(draft, payload);
      default:
        break;
    }
  }
}, initialState);

export default reducer;
