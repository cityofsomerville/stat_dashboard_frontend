import {
  getWebsiteDailyTotals,
  getWebsiteAverages
} from 'data/cityWebsite/requests';

export const types = [
  'WEBSITE_DAILY_TOTALS_SUCCESS',
  'WEBSITE_AVERAGE_SUCCESS',
  'REQUEST_ERROR'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

const fetchDailyTotals = () => {
  return async dispatch => {
    try {
      const response = await getWebsiteDailyTotals();
      dispatch({
        type: types.WEBSITE_DAILY_TOTALS_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.REQUEST_ERROR,
        payload: err
      });
    }
  };
};

const fetchWebsiteAverages = () => {
  return async dispatch => {
    try {
      const response = await getWebsiteAverages();
      dispatch({
        type: types.WEBSITE_AVERAGE_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.REQUEST_ERROR,
        payload: err
      });
    }
  };
};

export const fetchWebsiteData = () => {
  return dispatch => {
    dispatch(fetchDailyTotals());
    dispatch(fetchWebsiteAverages());
  };
};
