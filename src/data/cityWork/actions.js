import { getTickets, getActions, getTypes } from 'data/cityWork/requests';

export const types = [
  'ACTIONS_BY_DAY_SUCCESS',
  'ACTIONS_BY_DAY_ERROR',
  'TYPES_BY_ID_SUCCESS',
  'TYPES_BY_ID_ERROR',
  'TICKETS_SUCCESS',
  'TICKETS_ERROR',
  'SET_CATEGORY_PRESET',
  'SET_DATE_PRESET'
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
  return async dispatch => {
    try {
      // const typesResponse = await getTypes();
      // const tickets = await getTickets({ startDate, endDate });
      Promise.all([
        async () => {
          const typesResponse = await getTypes();
          dispatch({
            type: types.TYPES_BY_ID_SUCCESS,
            payload: typesResponse
          });
        },
        async () => {
          const tickets = await getTickets({ startDate, endDate });
          dispatch({
            type: types.TICKETS_SUCCESS,
            payload: tickets
          });
        }
      ]).then(() => {
        console.log('finished');
      });
      // dispatch({
      //   type: types.TYPES_TICKETS_LOADED
      // });
    } catch (err) {
      console.log(err);
      dispatch({
        type: types.TYPES_BY_ID_ERROR,
        payload: err
      });
    }
  };
};

export const setCategoryPreset = preset => {
  return {
    type: types.SET_CATEGORY_PRESET,
    payload: preset
  };
};

export const setDatePreset = preset => {
  return {
    type: types.SET_DATE_PRESET,
    payload: preset
  };
};

export const setDateRange = range => {
  return {
    type: types.SET_DATE_PRESET,
    payload: range
  };
};
