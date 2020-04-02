import {
  getTickets,
  getActions,
  getTypes,
  getCityWorkExploreData,
  getDailyAveragePerAction,
  getWeeklyAveragePerType,
  getCallsAverage,
  getBacklogCreated,
  getBacklogClosed
} from 'data/cityWork/requests';
import { getWeeklyTrends } from 'data/cityWork/utils';

export const types = [
  'ACTIONS_BY_DAY_SUCCESS',
  'TYPES_BY_ID_SUCCESS',
  'TICKETS_SUCCESS',
  'TYPES_TICKETS_LOADED',
  'EXPLORE_DATA_SUCCESS',
  'ACTION_AVERAGE_SUCCESS',
  'TYPE_AVERAGE_SUCCESS',
  'CALLS_AVERAGE_SUCCESS',
  'BACKLOG_CREATED_SUCCESS',
  'BACKLOG_CLOSED_SUCCESS',
  'REQUEST_ERROR'
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
        type: types.REQUEST_ERROR,
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
        })(),
        (async () => {
          const averages = await getWeeklyAveragePerType();
          return dispatch({
            type: types.TYPE_AVERAGE_SUCCESS,
            payload: averages.data
          });
        })()
        // once both have been stored, calculate weekly trends
      ]).then(() => {
        const state = getState();
        return dispatch({
          type: types.TYPES_TICKETS_LOADED,
          payload: getWeeklyTrends(
            state.cityWork.typesById,
            state.cityWork.tickets,
            state.cityWork.typeAverages
          )
        });
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
        type: types.REQUEST_ERROR,
        payload: err
      });
    }
  };
};

const fetchDailyAveragePerAction = () => {
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
        type: types.REQUEST_ERROR,
        payload: err
      });
    }
  };
};

const fetchCallsAverage = () => {
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
        type: types.REQUEST_ERROR,
        payload: err
      });
    }
  };
};

export const fetchAverages = () => {
  return dispatch => {
    dispatch(fetchDailyAveragePerAction());
    dispatch(fetchCallsAverage());
  };
};

const fetchBacklogCreated = () => {
  return async dispatch => {
    try {
      const response = await getBacklogCreated();
      dispatch({
        type: types.BACKLOG_CREATED_SUCCESS,
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

const fetchBacklogClosed = () => {
  return async dispatch => {
    try {
      const response = await getBacklogClosed();
      dispatch({
        type: types.BACKLOG_CLOSED_SUCCESS,
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

export const fetchBacklogData = () => {
  return dispatch => {
    dispatch(fetchBacklogCreated());
    dispatch(fetchBacklogClosed());
  };
};
