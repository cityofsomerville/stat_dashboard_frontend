import {
  getQOLCount,
  getCICount,
  getMVCCount,
  getTECount
} from 'data/publicSafety/requests';

export const types = [
  'REQUEST_ERROR',
  'QOL_COUNT_SUCCESS',
  'CI_COUNT_SUCCESS',
  'TE_COUNT_SUCCESS',
  'MVC_COUNT_SUCCESS'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

const makeRequest = ({ requestFn, success, error }) => {
  return async dispatch => {
    try {
      const response = await requestFn();
      dispatch({
        type: success,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: error,
        payload: err
      });
    }
  };
};

export const fetchKeyMetrics = () => {
  return dispatch => {
    dispatch(
      makeRequest({
        requestFn: getQOLCount,
        success: types.QOL_COUNT_SUCCESS,
        error: types.REQUEST_ERROR
      })
    );
    dispatch(
      makeRequest({
        requestFn: getCICount,
        success: types.CI_COUNT_SUCCESS,
        error: types.REQUEST_ERROR
      })
    );
    dispatch(
      makeRequest({
        requestFn: getMVCCount,
        success: types.MVC_COUNT_SUCCESS,
        error: types.REQUEST_ERROR
      })
    );
    dispatch(
      makeRequest({
        requestFn: getTECount,
        success: types.TE_COUNT_SUCCESS,
        error: types.REQUEST_ERROR
      })
    );
  };
};
