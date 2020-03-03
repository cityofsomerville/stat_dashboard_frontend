import { combineReducers } from 'redux';

import { types } from 'data/cityWebsite/actions';
import { indexBy } from 'data/utils';

const initialState = {
  dailyTotals: [],
  websiteAverages: {}
};

const dailyTotals = (state = initialState.dailyTotals, action) => {
  switch (action.type) {
    case types.WEBSITE_DAILY_TOTALS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const websiteAverages = (state = initialState.websiteAverages, action) => {
  switch (action.type) {
    case types.WEBSITE_AVERAGE_SUCCESS:
      return Object.assign({}, state, indexBy(action.payload, 'url'));
    default:
      return state;
  }
};

export default combineReducers({
  dailyTotals,
  websiteAverages
});
