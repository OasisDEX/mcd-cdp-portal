import { useContext } from 'react';
import { NotificationContext } from 'providers/NotificationProvider';

import {
  RESET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  DELETE_NOTIFICATION
} from 'providers/NotificationProvider';

function useNotification() {
  const { notifications, dispatch } = useContext(NotificationContext);

  const dispatchNotification = ({ action, payload }) =>
    dispatch({
      type: 'notifications',
      action,
      payload
    });

  const addNotification = props =>
    dispatchNotification({
      action: ADD_NOTIFICATION,
      payload: props
    });

  const deleteNotifications = notificationIds =>
    !!notificationIds.length &&
    notificationIds.map(payload =>
      dispatchNotification({
        action: DELETE_NOTIFICATION,
        payload: payload
      })
    );

  const resetNotifications = () =>
    dispatchNotification({
      action: RESET_NOTIFICATIONS
    });

  const notificationExists = id => {
    const { banners } = notifications;
    return !!banners[id.name];
  };

  return {
    addNotification,
    deleteNotifications,
    resetNotifications,
    notificationExists,
    ...notifications
  };
}

export default useNotification;
