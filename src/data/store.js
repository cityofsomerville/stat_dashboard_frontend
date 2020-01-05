import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import cityWork from 'data/cityWork/reducers';
import permits from 'data/permits/reducers';

export default createStore(
  combineReducers({
    cityWork,
    permits
  }),
  applyMiddleware(thunk)
);
