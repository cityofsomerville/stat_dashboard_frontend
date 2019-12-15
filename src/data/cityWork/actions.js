import { getTickets, getActions, getTypes } from 'data/Requests';

export const types = [
  'ACTIONS_BY_DAY_SUCCESS',
  'ACTIONS_BY_DAY_ERROR',
  'TYPES_BY_ID_SUCCESS',
  'TYPES_BY_ID_ERROR',
  'TICKETS_SUCCESS',
  'TICKETS_ERROR'
].reduce((memo, key) => ({ ...memo, [key]: key }), {});

const bucketByColumn = (set, column, transform) =>
  set.reduce((memo, item) => {
    if (!memo[item[column]]) {
      memo[item[column]] = {};
    }
    if (!memo[item[column]][item.code]) {
      memo[item[column]][item.code] = [];
    }
    memo[item[column]][item.code].push(item);
    return memo;
  }, {});

const typesById = types =>
  types.reduce((memo, type) => {
    return {
      ...memo,
      [type.id]: type
    };
  }, {});

export const fetchActionsByDay = ({ startDate, endDate }) => {
  return async dispatch => {
    try {
      const actions = await getActions({ startDate, endDate });
      dispatch({
        type: types.ACTIONS_BY_DAY_SUCCESS,
        payload: bucketByColumn(actions, 'action_day')
      });
    } catch (err) {
      console.log(err);
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
        payload: typesById(typesResponse)
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
