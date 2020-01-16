import {
  getPermitsExploreData,
  getDailyTotals,
  getTypeAverages
} from 'data/permits/requests';

export const types = [
  'PERMITS_EXPLORE_DATA_SUCCESS',
  'PERMITS_EXPLORE_DATA_ERROR',
  'PERMITS_DAILY_TOTALS_SUCCESS',
  'PERMITS_DAILY_TOTALS_ERROR',
  'PERMITS_TYPE_AVERAGES_SUCCESS',
  'PERMITS_TYPE_AVERAGES_ERROR'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

export const fetchPermitsExploreData = key => {
  return async dispatch => {
    try {
      const response = await getPermitsExploreData(key);
      dispatch({
        type: types.PERMITS_EXPLORE_DATA_SUCCESS,
        payload: response.data,
        key
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.PERMITS_EXPLORE_DATA_ERROR,
        payload: err
      });
    }
  };
};

const fetchDailyTotals = () => {
  return async dispatch => {
    try {
      const response = await getDailyTotals();
      dispatch({
        type: types.PERMITS_DAILY_TOTALS_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.PERMITS_DAILY_TOTALS_ERROR,
        payload: err
      });
    }
  };
};

const fetchTypeAverages = () => {
  return async dispatch => {
    try {
      const response = await getTypeAverages();
      dispatch({
        type: types.PERMITS_TYPE_AVERAGES_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.PERMITS_TYPE_AVERAGES_ERROR,
        payload: err
      });
    }
  };
};

export const fetchKeyMetrics = () => {
  return dispatch => {
    dispatch(fetchDailyTotals());
    dispatch(fetchTypeAverages());
  };
};
