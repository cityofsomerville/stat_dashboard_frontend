import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import cityWork from 'data/cityWork/reducers';
import permits from 'data/permits/reducers';
import publicSafety from 'data/publicSafety/reducers';
import cityWebsite from 'data/cityWebsite/reducers';

export default createStore(
  combineReducers({
    cityWork,
    permits,
    publicSafety,
    cityWebsite
  }),
  applyMiddleware(thunk)
);
