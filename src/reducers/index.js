import { enableBatching } from 'utils/redux';
import notificationsReducer from 'reducers/notifications';
import mathReducer from './math';

const rootReducer = ({ notifications, raw }, action) => {
  const combinedState = {
    notifications: notificationsReducer(notifications, action),
    raw
  };

  return mathReducer(combinedState, action);
};

export const initialState = rootReducer({}, { type: 'CLEAR_CONTRACT_STATE' });

export default enableBatching(rootReducer);
