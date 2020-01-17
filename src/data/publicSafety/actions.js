import {
  getQOLCount,
  getCICount,
  getMVCCount,
  getTECount,
  getQOLExploreData
} from 'data/publicSafety/requests';

export const types = [
  'REQUEST_ERROR',
  'QOL_COUNT_SUCCESS',
  'CI_COUNT_SUCCESS',
  'TE_COUNT_SUCCESS',
  'MVC_COUNT_SUCCESS',
  'QOL_EXPLORE_DATA_SUCCESS',
  'CI_EXPLORE_DATA_SUCCESS',
  'TE_EXPLORE_DATA_SUCCESS',
  'MVC_EXPLORE_DATA_SUCCESS'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

const makeRequest = ({ requestFn, args, success, error, extraParams }) => {
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
    // dispatch(makeRequest({
    //   requestFn: getCICount,
    //   success: types.CI_COUNT_SUCCESS,
    //   error: types.REQUEST_ERROR
    // }));
    // dispatch(makeRequest({
    //   requestFn: getMVCCount,
    //   success: types.MVC_COUNT_SUCCESS,
    //   error: types.REQUEST_ERROR
    // }));
    // dispatch(makeRequest({
    //   requestFn: getTECount,
    //   success: types.TE_COUNT_SUCCESS,
    //   error: types.REQUEST_ERROR
    // }));
  };
};

export const fetchPublicSafetyExploreData = params => {
  return dispatch => {
    const { preset } = JSON.parse(params);
    switch (preset) {
      case 'Quality of Life':
        dispatch(
          makeRequest({
            requestFn: getQOLExploreData,
            args: params,
            extraParams: { key: params },
            success: types.QOL_EXPLORE_DATA_SUCCESS,
            error: types.REQUEST_ERROR
          })
        );
        break;
      // case 'Criminal Incidents':

      // case 'Motor Vehicle Citations':

      // case 'Traffic Enforcement':

      default:
    }
  };
};
