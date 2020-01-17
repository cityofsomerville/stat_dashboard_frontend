import { combineReducers } from 'redux';

import { types } from 'data/publicSafety/actions';
import { indexBy } from 'data/utils';

const initialState = {
  exploreDataCache: [],
  exploreDataParams: null,
  dailyTotals: {},
  typeAverages: {}
};

// const exploreDataParams = (state = initialState.exploreDataParams, action) => {
//   switch (action.type) {
//     case types.PERMITS_EXPLORE_DATA_SUCCESS:
//       return action.key;
//     default:
//       return state;
//   }
// };

// const exploreDataCache = (state = initialState.exploreDataCache, action) => {
//   switch (action.type) {
//     case types.PERMITS_EXPLORE_DATA_SUCCESS:
//       return [...action.payload];
//     default:
//       return state;
//   }
// };

const dailyTotals = (state = initialState.dailyTotals, action) => {
  switch (action.type) {
    case types.QOL_COUNT_SUCCESS:
      return Object.assign({}, state, {
        qol: Number(action.payload[0].count)
      });
    case types.CI_COUNT_SUCCESS:
      return Object.assign({}, state, {
        ci: Number(action.payload[0].count)
      });
    case types.MVC_COUNT_SUCCESS:
      return Object.assign({}, state, {
        mvc: Number(action.payload[0].count)
      });
    case types.TE_COUNT_SUCCESS:
      return Object.assign({}, state, {
        te: Number(action.payload[0].count)
      });
    default:
      return state;
  }
};

// const typeAverages = (state = initialState.typeAverages, action) => {
//   switch (action.type) {
//     case types.PERMITS_TYPE_AVERAGES_SUCCESS:
//       return Object.assign({}, state, indexBy(action.payload, 'type'));
//     default:
//       return state;
//   }
// };

export default combineReducers({
  // exploreDataParams,
  // exploreDataCache,
  dailyTotals
  // typeAverages
});
