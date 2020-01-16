import {
  getTickets,
  getActions,
  getTypes,
  getCityWorkExploreData,
  getDailyAveragePerAction,
  getWeeklyAveragePerType,
  getCallsAverage
} from 'data/cityWork/requests';
import { getWeeklyTrends } from 'data/cityWork/utils';

export const types = [
  'ACTIONS_BY_DAY_SUCCESS',
  'ACTIONS_BY_DAY_ERROR',
  'TYPES_BY_ID_SUCCESS',
  'TYPES_BY_ID_ERROR',
  'TICKETS_SUCCESS',
  'TICKETS_ERROR',
  'TYPES_TICKETS_LOADED',
  'EXPLORE_DATA_SUCCESS',
  'EXPLORE_DATA_ERROR',
  'ACTION_AVERAGE_SUCCESS',
  'ACTION_AVERAGE_ERROR',
  'TYPE_AVERAGE_SUCCESS',
  'TYPE_AVERAGE_ERROR',
  'CALLS_AVERAGE_SUCCESS',
  'CALLS_AVERAGE_ERROR'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

export const fetchActionsByDay = ({ startDate, endDate }) => {
  return async dispatch => {
    try {
      const actions = await getActions({ startDate, endDate });
      dispatch({
        type: types.ACTIONS_BY_DAY_SUCCESS,
        payload: actions.data
      });
    } catch (err) {
      dispatch({
        type: types.ACTIONS_BY_DAY_ERROR,
        payload: err
      });
    }
  };
};

export const fetchTypesTickets = ({ startDate, endDate }) => {
  return async (dispatch, getState) => {
    try {
      // request both tickets and types -- order doesn't matter
      return Promise.all([
        (async () => {
          const typesResponse = await getTypes();
          return dispatch({
            type: types.TYPES_BY_ID_SUCCESS,
            payload: typesResponse.data
          });
        })(),
        (async () => {
          const tickets = await getTickets({ startDate, endDate });
          return dispatch({
            type: types.TICKETS_SUCCESS,
            payload: tickets.data
          });
        })()
        // once both have been stored, calculate weekly trends
      ]).then(() => {
        const state = getState();
        return dispatch({
          type: types.TYPES_TICKETS_LOADED,
          payload: getWeeklyTrends(
            state.cityWork.typesById,
            state.cityWork.tickets
          )
        });
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.TYPES_BY_ID_ERROR,
        payload: err
      });
    }
  };
};

export const fetchCityWorkExploreData = key => {
  return async dispatch => {
    try {
      const response = await getCityWorkExploreData(key);
      dispatch({
        type: types.EXPLORE_DATA_SUCCESS,
        payload: response.data,
        key
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.EXPLORE_DATA_ERROR,
        payload: err
      });
    }
  };
};

export const fetchDailyAveragePerAction = () => {
  return async dispatch => {
    try {
      const response = await getDailyAveragePerAction();
      dispatch({
        type: types.ACTION_AVERAGE_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.ACTION_AVERAGE_ERROR,
        payload: err
      });
    }
  };
};

export const fetchWeeklyAveragePerType = () => {
  return async dispatch => {
    try {
      const response = await getWeeklyAveragePerType();
      dispatch({
        type: types.TYPE_AVERAGE_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.TYPE_AVERAGE_ERROR,
        payload: err
      });
    }
  };
};

export const fetchCallsAverage = () => {
  return async dispatch => {
    try {
      const response = await getCallsAverage();
      dispatch({
        type: types.CALLS_AVERAGE_SUCCESS,
        payload: response.data
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.CALLS_AVERAGE_ERROR,
        payload: err
      });
    }
  };
};

export const fetchAverages = () => {
  return dispatch => {
    dispatch(fetchDailyAveragePerAction());
    dispatch(fetchWeeklyAveragePerType());
    dispatch(fetchCallsAverage());
  };
};
