import produce from 'immer';

export const RESET_NOTIFICATIONS = 'resetAllNotifications';
export const ADD_NOTIFICATION = 'addNotification';
export const DELETE_NOTIFICATION = 'deleteNotification';

const initialState = {
  banners: {},
  viewable: true
};

const addNotification = (state, { id: { name, priority }, ...rest }) => {
  console.log(name, priority);
  return {
    ...state,
    banners: {
      ...state.banners,
      [name]: { ...rest, priority }
    }
  };
};

const deleteNotification = (state, { name }) => {
  const {
    banners: { [name]: _, ...rest }
  } = state;
  return {
    ...state,
    banners: rest
  };
};

const reducer = produce((draft, { type, action, payload }) => {
  if (!type) return;
  if (type === 'notifications') {
    switch (action) {
      case RESET_NOTIFICATIONS:
        return initialState;
      case ADD_NOTIFICATION:
        return addNotification(draft, payload);
      case DELETE_NOTIFICATION:
        return deleteNotification(draft, payload);
      default:
        break;
    }
  }
}, initialState);

export default reducer;
