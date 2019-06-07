import { enableBatching } from 'utils/redux';
import systemReducer from 'reducers/system';
import feedsReducer from 'reducers/feeds';
import cdpsReducer from 'reducers/cdps';
import mathReducer from './math';

const rootReducer = ({ system, feeds, cdps, raw }, action) => {
  const combinedState = {
    system: systemReducer(system, action),
    feeds: feedsReducer(feeds, action),
    cdps: cdpsReducer(cdps, action),
    raw
  };

  return mathReducer(combinedState, action);
};

export default enableBatching(rootReducer);
