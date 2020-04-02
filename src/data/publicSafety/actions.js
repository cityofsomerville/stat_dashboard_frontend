import {
  getQOLCount,
  getCICount,
  getMVCCount,
  getTECount,
  getQOLAverage,
  getCIAverage,
  getMVCAverage,
  getTEAverage,
  getQOLExploreData,
  getCIExploreData,
  getTEExploreData,
  getMVCExploreData
} from 'data/publicSafety/requests';

export const types = [
  'REQUEST_ERROR',
  'QOL_COUNT_SUCCESS',
  'CI_COUNT_SUCCESS',
  'TE_COUNT_SUCCESS',
  'MVC_COUNT_SUCCESS',
  'QOL_AVERAGE_SUCCESS',
  'CI_AVERAGE_SUCCESS',
  'TE_AVERAGE_SUCCESS',
  'MVC_AVERAGE_SUCCESS',
  'EXPLORE_PUBLIC_SAFETY_DATA_SUCCESS'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

// todo: replace all async request wrapper actions with this
const makeRequest = ({ requestFn, args, success, extraParams }) => {
  return async dispatch => {
    try {
      const response = await requestFn(args);
      dispatch(
        Object.assign(
          {
            type: success,
            payload: response.data
          },
          extraParams
        )
      );
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.REQUEST_ERROR,
        payload: err
      });
    }
  };
};

export const fetchKeyMetrics = () => {
  return dispatch => {
    dispatch(
      makeRequest({ requestFn: getQOLCount, success: types.QOL_COUNT_SUCCESS })
    );
    dispatch(
      makeRequest({
        requestFn: getQOLAverage,
        success: types.QOL_AVERAGE_SUCCESS
      })
    );
    dispatch(
      makeRequest({ requestFn: getCICount, success: types.CI_COUNT_SUCCESS })
    );
    dispatch(
      makeRequest({
        requestFn: getCIAverage,
        success: types.CI_AVERAGE_SUCCESS
      })
    );
    dispatch(
      makeRequest({ requestFn: getMVCCount, success: types.MVC_COUNT_SUCCESS })
    );
    dispatch(
      makeRequest({
        requestFn: getMVCAverage,
        success: types.MVC_AVERAGE_SUCCESS
      })
    );
    dispatch(
      makeRequest({ requestFn: getTECount, success: types.TE_COUNT_SUCCESS })
    );
    dispatch(
      makeRequest({
        requestFn: getTEAverage,
        success: types.TE_AVERAGE_SUCCESS
      })
    );
  };
};

export const fetchPublicSafetyExploreData = params => {
  return dispatch => {
    const { preset } = JSON.parse(params);
    const requestFns = {
      'Quality of Life': getQOLExploreData,
      'Criminal Incidents': getCIExploreData,
      'Traffic Enforcement': getTEExploreData,
      'Motor Vehicle Citations': getMVCExploreData
    };
    dispatch(
      makeRequest({
        requestFn: requestFns[preset],
        args: params,
        extraParams: { key: params },
        success: types.EXPLORE_PUBLIC_SAFETY_DATA_SUCCESS
      })
    );
  };
};
