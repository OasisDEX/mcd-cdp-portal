import React, { createContext, useReducer } from 'react';

export const RESET_NOTIFICATIONS = 'resetAllNotifications';
export const ADD_NOTIFICATION = 'addNotification';
export const DELETE_NOTIFICATION = 'deleteNotification';

const initialState = {
  banners: {},
  viewable: true
};

export const NotificationContext = createContext();

const addNotification = (state, { id: { name, priority }, ...rest }) => {
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

const notificationsReducer = (state, { action, payload }) => {
  switch (action) {
    case RESET_NOTIFICATIONS:
      return initialState;
    case ADD_NOTIFICATION:
      return addNotification(state, payload);
    case DELETE_NOTIFICATION:
      return deleteNotification(state, payload);
    default:
      break;
  }
};

function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(
    notificationsReducer,
    initialState
  );

  return (
    <NotificationContext.Provider value={{ notifications, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
