import { createSelector } from 'reselect';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import startOfYesterday from 'date-fns/startOfYesterday';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';

import { SOCRATA_TIMESTAMP } from 'data/Constants';

const WORK_ORDERS_CREATED_CATEGORY = 9;
const WORK_ORDERS_CLOSED_CATEGORY = 6;

const actionsByDaySelector = state => state.cityWork.actionsByDay;
const ticketsSelector = state => state.cityWork.tickets;
const typesByIdSelector = state => state.cityWork.typesById;

export const getWorkOrders = createSelector(
  actionsByDaySelector,
  actionsByDay => {
    let metrics = {
      created: { figure: null, delta: null },
      closed: { figure: null, delta: null }
    };

    const yesterday =
      actionsByDay[format(startOfYesterday(), SOCRATA_TIMESTAMP)];

    const twoDaysAgo =
      actionsByDay[format(subDays(startOfYesterday(), 1), SOCRATA_TIMESTAMP)];

    if (yesterday && twoDaysAgo) {
      const createdYesterday = yesterday[WORK_ORDERS_CREATED_CATEGORY].length;
      const closedYesterday = yesterday[WORK_ORDERS_CLOSED_CATEGORY].length;
      const createdTwoDaysAgo = twoDaysAgo[WORK_ORDERS_CREATED_CATEGORY].length;
      const closedTwoDaysAgo = twoDaysAgo[WORK_ORDERS_CLOSED_CATEGORY].length;

      metrics = {
        created: {
          figure: createdYesterday,
          delta: createdYesterday - createdTwoDaysAgo
        },
        closed: {
          figure: closedYesterday,
          delta: closedYesterday - closedTwoDaysAgo
        }
      };
    }
    return metrics;
  }
);

export const get311Calls = createSelector(ticketsSelector, tickets => {
  let metrics = {
    calls: {
      figure: null,
      delta: null
    }
  };

  if (tickets.length) {
    const callsYesterday = tickets.filter(
      ticket =>
        ticket.origin === 'Call Center' &&
        new Date(ticket.last_modified) >= startOfYesterday
    ).length;

    const callsTwoDaysAgo = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.last_modified);
      return (
        ticket.origin === 'Call Center' &&
        ticketDate < startOfYesterday() &&
        ticketDate >= subDays(startOfYesterday(), 1)
      );
    }).length;

    metrics.calls = {
      figure: callsYesterday,
      delta: callsYesterday - callsTwoDaysAgo
    };
  }
  return metrics;
});

export const getKeyMetrics = createSelector(
  [getWorkOrders, get311Calls],
  (workOrders, calls) => ({ ...workOrders, ...calls })
);

// TODO: fix these hardcoded type ids
export const getWorkOrderChartData = createSelector(
  actionsByDaySelector,
  actionsByDay => {
    const dates = Object.keys(actionsByDay).sort((a, b) => {
      return isBefore(parseISO(a), parseISO(b));
    });
    return {
      data: dates.map(date => ({
        Date: format(new Date(date), 'MMM d'),
        'Tickets Opened': actionsByDay[date][9].length,
        'Tickets Closed': actionsByDay[date][6].length
      })),
      columns: ['Date', 'Tickets Opened', 'Tickets Closed']
    };
  }
);

export const getWeeklyTrends = createSelector(
  [ticketsSelector, typesByIdSelector],
  (tickets, types) => {
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
          // const ticketTime = new Date(ticket.last_modified);
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
  }
);
