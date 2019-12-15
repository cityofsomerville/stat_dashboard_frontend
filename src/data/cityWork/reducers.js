import { combineReducers } from 'redux';
import format from 'date-fns/format';
import startOfYesterday from 'date-fns/startOfYesterday';
import subDays from 'date-fns/subDays';

import { types } from 'data/cityWork/actions';

// import {
//   SOCRATA_TIMESTAMP,
//   WORK_ORDERS_OPENED_CATEGORY,
//   WORK_ORDERS_CLOSED_CATEGORY
// } from 'data/constants';

const SOCRATA_TIMESTAMP = "yyyy-MM-dd'T'HH:mm:ss.SSS";
const WORK_ORDERS_CREATED_CATEGORY = 9;
const WORK_ORDERS_CLOSED_CATEGORY = 6;

const initialState = {
  actionsByDay: {}, // actions, error
  typesById: {}, // types, error
  tickets: [], // tickets, error. possibly just store all tickets here

  workOrdersChartData: {}, // { data: [], columns: [] }
  keyMetrics: {
    created: { figure: null, delta: null },
    closed: { figure: null, delta: null },
    calls: { figure: null, delta: null }
  },
  weeklyTrends: [] // could be { categories: [], trends: [] }
};

const keyMetrics = (state = initialState.keyMetrics, action) => {
  switch (action.type) {
    case types.ACTIONS_BY_DAY_SUCCESS:
      // const yesterday = action.payload[format(startOfYesterday(), SOCRATA_TIMESTAMP)];
      // const twoDaysAgo = action.payload[format(subDays(startOfYesterday(), 1), SOCRATA_TIMESTAMP)];
      // FIXME
      const yesterday =
        action.payload[
          format(subDays(startOfYesterday(), 1), SOCRATA_TIMESTAMP)
        ];
      const twoDaysAgo =
        action.payload[
          format(subDays(startOfYesterday(), 2), SOCRATA_TIMESTAMP)
        ];

      const createdYesterday = yesterday[WORK_ORDERS_CREATED_CATEGORY].length;
      const closedYesterday = yesterday[WORK_ORDERS_CLOSED_CATEGORY].length;
      const createdTwoDaysAgo = twoDaysAgo[WORK_ORDERS_CREATED_CATEGORY].length;
      const closedTwoDaysAgo = twoDaysAgo[WORK_ORDERS_CLOSED_CATEGORY].length;

      return Object.assign({}, state, {
        created: {
          figure: createdYesterday,
          delta: createdYesterday - createdTwoDaysAgo
        },
        closed: {
          figure: closedYesterday,
          delta: closedYesterday - closedTwoDaysAgo,
          label: 'work orders closed'
        }
      });

    case types.TICKETS_SUCCESS:
      const callsYesterday = action.payload.filter(
        ticket =>
          ticket.origin === 'Call Center' &&
          new Date(ticket.last_modified) >= startOfYesterday
      ).length;

      const callsTwoDaysAgo = action.payload.filter(ticket => {
        const ticketDate = new Date(ticket.last_modified);
        return (
          ticket.origin === 'Call Center' &&
          ticketDate < startOfYesterday() &&
          ticketDate >= subDays(startOfYesterday(), 1)
        );
      }).length;

      return Object.assign({}, state, {
        calls: {
          figure: callsYesterday,
          delta: callsYesterday - callsTwoDaysAgo
        }
      });
    default:
      return state;
  }
};

export default combineReducers({
  keyMetrics
});
