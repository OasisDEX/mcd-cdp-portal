import { enableBatching } from 'utils/redux';
import systemReducer from 'reducers/system';
import feedsReducer from 'reducers/feeds';
import cdpsReducer from 'reducers/cdps';
import savingsReducer from 'reducers/savings';
import notificationsReducer from 'reducers/notifications';
import mathReducer from './math';

const rootReducer = (
  { system, feeds, cdps, accounts, savings, notifications, raw },
  action
) => {
  const combinedState = {
    system: systemReducer(system, action),
    feeds: feedsReducer(feeds, action),
    cdps: cdpsReducer(cdps, action),
    savings: savingsReducer(savings, action),
    notifications: notificationsReducer(notifications, action),
    raw
  };

  return mathReducer(combinedState, action);
};

export const initialState = rootReducer({}, { type: 'CLEAR_CONTRACT_STATE' });

export default enableBatching(rootReducer);
