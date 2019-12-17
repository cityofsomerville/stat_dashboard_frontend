import {
  getTickets,
  getActions,
  getTypes,
  getCityWorkExploreData
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
  'UPDATE_SELECTION_KEY'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

export const fetchActionsByDay = ({ startDate, endDate }) => {
  return async dispatch => {
    try {
      const actions = await getActions({ startDate, endDate });
      dispatch({
        type: types.ACTIONS_BY_DAY_SUCCESS,
        payload: actions
      });
    } catch (err) {
      dispatch({
        type: types.ACTIONS_BY_DAY_ERROR,
        payload: err
      });
    }
  };
};

export const fetchTickets = ({ startDate, endDate }) => {
  return async dispatch => {
    try {
      const tickets = await getTickets({ startDate, endDate });
      dispatch({
        type: types.TICKETS_SUCCESS,
        payload: tickets
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.TICKETS_ERROR,
        payload: err
      });
    }
  };
};

export const fetchTypesById = () => {
  return async dispatch => {
    try {
      const typesResponse = await getTypes();
      dispatch({
        type: types.TYPES_BY_ID_SUCCESS,
        payload: typesResponse
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

export const fetchTypesTickets = ({ startDate, endDate }) => {
  return async (dispatch, getState) => {
    try {
      // request both tickets and types -- order doesn't matter
      return Promise.all([
        (async () => {
          const typesResponse = await getTypes();
          return dispatch({
            type: types.TYPES_BY_ID_SUCCESS,
            payload: typesResponse
          });
        })(),
        (async () => {
          const tickets = await getTickets({ startDate, endDate });
          return dispatch({
            type: types.TICKETS_SUCCESS,
            payload: tickets
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
        payload: response,
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

export const updateSelectionKey = key => ({
  type: types.UPDATE_SELECTION_KEY,
  key
});
