import { enableBatching } from 'utils/redux';
import systemReducer from 'reducers/system';
import feedsReducer from 'reducers/feeds';
import cdpsReducer from 'reducers/cdps';
import accountsReducer from 'reducers/accounts';
import savingsReducer from 'reducers/savings';
import mathReducer from './math';

const rootReducer = (
  { system, feeds, cdps, accounts, savings, raw },
  action
) => {
  const combinedState = {
    system: systemReducer(system, action),
    feeds: feedsReducer(feeds, action),
    cdps: cdpsReducer(cdps, action),
    accounts: accountsReducer(accounts, action),
    savings: savingsReducer(savings, action),
    raw
  };

  return mathReducer(combinedState, action);
};

export default enableBatching(rootReducer);
