import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import cityWork from 'data/cityWork/reducers';

export default createStore(
  combineReducers({
    cityWork
  }),
  applyMiddleware(thunk)
);
