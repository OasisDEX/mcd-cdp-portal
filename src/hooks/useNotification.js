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

  const deleteNotification = props =>
    dispatchNotification({
      action: DELETE_NOTIFICATION,
      payload: props
    });

  const resetNotification = () =>
    dispatchNotification({
      action: RESET_NOTIFICATIONS
    });

  const notificationExists = id => {
    const { banners } = notifications;
    return banners && !!banners[id];
  };

  return {
    addNotification,
    deleteNotification,
    resetNotification,
    notificationExists,
    ...notifications
  };
}

export default useNotification;
