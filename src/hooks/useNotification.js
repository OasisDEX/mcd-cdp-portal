import useStore from 'hooks/useStore';
import {
  RESET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  DELETE_NOTIFICATION
} from 'reducers/notifications';

function useNotification() {
  const [{ notifications }, dispatch] = useStore();

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

  return {
    addNotification,
    deleteNotifications,
    resetNotifications,
    ...notifications
  };
}

export default useNotification;
