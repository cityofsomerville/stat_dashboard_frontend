import { combineReducers } from 'redux';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';

import { types } from 'data/cityWork/actions';
import { SOCRATA_TIMESTAMP } from 'data/Constants';
import { indexBy, groupBy } from 'data/utils';

const WORK_ORDERS_CREATED_CATEGORY = 9;
const WORK_ORDERS_CLOSED_CATEGORY = 6;

const createActionsByDay = () => {
  const actions = {};
  for (let i = 7; i > 0; i--) {
    actions[format(subDays(startOfToday(), i), SOCRATA_TIMESTAMP)] = {
      [WORK_ORDERS_CREATED_CATEGORY]: [],
      [WORK_ORDERS_CLOSED_CATEGORY]: []
    };
  }
  return actions;
};

const initialState = {
  actionsByDay: createActionsByDay(),
  typesById: {},
  tickets: [],
  actionAverages: {},
  typeAverages: {},
  callsAverage: null,
  weeklyTrends: [],
  exploreDataCache: [],
  exploreDataKey: null,
  backlogCreated: {},
  backlogClosed: {}
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

const weeklyTrends = (state = initialState.weeklyTrends, action) => {
  switch (action.type) {
    case types.TYPES_TICKETS_LOADED:
      return action.payload;
    default:
      return state;
  }
};

const exploreDataKey = (state = initialState.exploreDataKey, action) => {
  switch (action.type) {
    case types.EXPLORE_DATA_SUCCESS:
      return action.key;
    case types.UPDATE_SELECTION_KEY:
      return action.key;
    default:
      return state;
  }
};

const exploreDataCache = (state = initialState.exploreDataCache, action) => {
  switch (action.type) {
    case types.EXPLORE_DATA_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

const actionAverages = (state = initialState.actionAverages, action) => {
  switch (action.type) {
    case types.ACTION_AVERAGE_SUCCESS:
      return Object.assign({}, state, indexBy(action.payload, 'codeDesc'));
    default:
      return state;
  }
};

const typeAverages = (state = initialState.typeAverages, action) => {
  switch (action.type) {
    case types.TYPE_AVERAGE_SUCCESS:
      return Object.assign({}, state, indexBy(action.payload, 'type'));
    default:
      return state;
  }
};

const callsAverage = (state = initialState.callsAverage, action) => {
  switch (action.type) {
    case types.CALLS_AVERAGE_SUCCESS:
      return Number(action.payload[0].daily_average);
    default:
      return state;
  }
};

const backlogCreated = (state = initialState.backlogCreated, action) => {
  switch (action.type) {
    case types.BACKLOG_CREATED_SUCCESS:
      return Object.assign({}, state, groupBy(action.payload, 'dept'));
    default:
      return state;
  }
};

const backlogClosed = (state = initialState.backlogClosed, action) => {
  switch (action.type) {
    case types.BACKLOG_CLOSED_SUCCESS:
      return Object.assign({}, state, groupBy(action.payload, 'dept'));
    default:
      return state;
  }
};

export default combineReducers({
  actionsByDay,
  tickets,
  typesById,
  weeklyTrends,
  exploreDataKey,
  exploreDataCache,
  actionAverages,
  typeAverages,
  callsAverage,
  backlogCreated,
  backlogClosed
});
