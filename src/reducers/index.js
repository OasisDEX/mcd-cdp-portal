import { enableBatching } from 'utils/redux';
import systemReducer from 'reducers/system';
import feedsReducer from 'reducers/feeds';
import cdpsReducer from 'reducers/cdps';

const rootReducer = ({ system, feeds, cdps }, action) => ({
  system: systemReducer(system, action),
  feeds: feedsReducer(feeds, action),
  cdps: cdpsReducer(cdps, action)
});

export default enableBatching(rootReducer);
