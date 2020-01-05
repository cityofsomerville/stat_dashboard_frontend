import { combineReducers } from 'redux';

import { types } from 'data/permits/actions';
import { SOCRATA_TIMESTAMP } from 'data/Constants';

const initialState = {
  exploreDataCache: {},
  exploreDataKey: null
};

const exploreDataKey = (state = initialState.exploreDataKey, action) => {
  switch (action.type) {
    case types.PERMITS_EXPLORE_DATA_SUCCESS:
      return action.key;
    case types.PERMITS_UPDATE_SELECTION_KEY:
      return action.key;
    default:
      return state;
  }
};

const exploreDataCache = (state = initialState.exploreDataCache, action) => {
  switch (action.type) {
    case types.PERMITS_EXPLORE_DATA_SUCCESS:
      return Object.assign({}, state, {
        [action.key]: action.payload
      });
    default:
      return state;
  }
};

export default combineReducers({
  exploreDataKey,
  exploreDataCache
});
