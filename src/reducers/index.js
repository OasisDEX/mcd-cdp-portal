import systemReducer from 'reducers/system';
import feedsReducer from 'reducers/feeds';

const rootReducer = ({ system, feeds }, action) => ({
  system: systemReducer(system, action),
  feeds: feedsReducer(feeds, action)
});

export default rootReducer;
