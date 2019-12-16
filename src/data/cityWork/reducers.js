import { combineReducers } from 'redux';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';

import { types } from 'data/cityWork/actions';
import { DATE_PRESETS, SOCRATA_TIMESTAMP } from 'data/Constants';

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
  typesById: {}, // types, error
  tickets: [], // tickets, error. possibly just store all tickets here

  weeklyTrends: [], // could be { categories: [], trends: [] }

  selectedCategories: { preset: 'Weekly Trends', categories: [] },
  selectedDates: { preset: '7 days', range: DATE_PRESETS['7 days'] }
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
  const getWeeklyTrends = (types, tickets) => {
    let weeklyTrends = [];
    const startOfWeek = subDays(startOfToday(), 7);
    const upsertTicket = (bucket, ticket) => {
      if (!bucket[ticket.type]) {
        bucket[ticket.type] = [];
      }
      bucket[ticket.type].push(ticket);
    };

    if (Object.keys(types).length && tickets.length) {
      const ticketsByWeek = tickets.reduce(
        (memo, ticket) => {
          if (isBefore(parseISO(ticket.last_modified), startOfWeek)) {
            upsertTicket(memo.lastWeek, ticket);
          } else {
            upsertTicket(memo.thisWeek, ticket);
          }
          return memo;
        },
        { lastWeek: {}, thisWeek: {} }
      );
      weeklyTrends = Object.keys(ticketsByWeek.thisWeek)
        .map(key => {
          const thisWeekCount = ticketsByWeek.thisWeek[key].length;
          const lastWeekCount = ticketsByWeek.lastWeek[key]
            ? ticketsByWeek.lastWeek[key].length
            : 0;
          return {
            trend: Math.round(
              ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100
            ),
            countIncrease: thisWeekCount - lastWeekCount,
            label: types[key].name,
            type: types[key].ancestor_id,
            thisWeekCount,
            lastWeekCount
          };
        })
        .sort((a, b) => b.countIncrease - a.countIncrease)
        .slice(0, 3);
    }
    return weeklyTrends;
  };

  switch (action.type) {
    case types.TYPES_TICKETS_LOADED:
      return getWeeklyTrends(action.typesById, action.tickets);
    default:
      return state;
  }
};

const selectedCategories = (
  state = initialState.selectedCategories,
  action
) => {
  switch (action.type) {
    case types.SET_CATEGORY_PRESET:
      return action.payload;
    default:
      return state;
  }
};

const selectedDates = (state = initialState.selectedDates, action) => {
  switch (action.type) {
    case types.SET_DATE_PRESET:
      if (Object.keys(DATE_PRESETS).indexOf(action.payload) > -1) {
        return {
          preset: action.payload,
          range: DATE_PRESETS[action.payload]
        };
      }
      return state;
    case types.SET_DATE_RANGE:
      return Object.assign({}, state, { range: action.payload });
    default:
      return state;
  }
};

export default combineReducers({
  actionsByDay,
  tickets,
  typesById,
  weeklyTrends,
  selectedCategories,
  selectedDates
});
