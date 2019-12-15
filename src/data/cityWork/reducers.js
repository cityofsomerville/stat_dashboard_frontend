import { combineReducers } from 'redux';

import { types } from 'data/cityWork/actions';

const WORK_ORDERS_CREATED_CATEGORY = 9;
const WORK_ORDERS_CLOSED_CATEGORY = 6;

const initialState = {
  actionsByDay: {}, // actions, error
  typesById: {}, // types, error
  tickets: [], // tickets, error. possibly just store all tickets here

  weeklyTrends: [] // could be { categories: [], trends: [] }
};

const actionsByDay = (state = initialState.actionsByDay, action) => {
  switch (action.type) {
    case types.ACTIONS_BY_DAY_SUCCESS:
      return Object.assign(
        {},
        state,
        action.payload.reduce((memo, item) => {
          if (!memo[item.action_day]) {
            memo[item.action_day] = {
              [WORK_ORDERS_CREATED_CATEGORY]: [],
              [WORK_ORDERS_CLOSED_CATEGORY]: []
            };
          }
          memo[item.action_day][item.code].push(item);
          return memo;
        }, {})
      );
    default:
      return state;
  }
};

const tickets = (state = initialState.tickets, action) => {
  switch (action.type) {
    case types.TICKETS_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

const typesById = (state = initialState.typesById, action) => {
  switch (action.type) {
    case types.TYPES_BY_ID_SUCCESS:
      return Object.assign(
        {},
        state,
        action.payload.reduce(
          (memo, type) => ({
            ...memo,
            [type.id]: type
          }),
          {}
        )
      );
    default:
      return state;
  }
};

export default combineReducers({
  actionsByDay,
  tickets,
  typesById
});
