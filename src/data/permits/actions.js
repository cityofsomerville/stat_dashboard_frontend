import { getPermitsExploreData } from 'data/permits/requests';

export const types = [
  'PERMITS_EXPLORE_DATA_SUCCESS',
  'PERMITS_EXPLORE_DATA_ERROR'
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
