import { combineReducers } from 'redux';

import { types } from 'data/permits/actions';

const initialState = {
  exploreDataCache: [],
  exploreDataParams: null
};

const exploreDataParams = (state = initialState.exploreDataParams, action) => {
  switch (action.type) {
    case types.PERMITS_EXPLORE_DATA_SUCCESS:
      return action.key;
    default:
      return state;
  }
};

const exploreDataCache = (state = initialState.exploreDataCache, action) => {
  switch (action.type) {
    case types.PERMITS_EXPLORE_DATA_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

export default combineReducers({
  exploreDataParams,
  exploreDataCache
});
