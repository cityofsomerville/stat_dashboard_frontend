import { createSelector } from 'reselect';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import startOfYesterday from 'date-fns/startOfYesterday';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';

import { SOCRATA_TIMESTAMP } from 'data/Constants';

const WORK_ORDERS_CREATED_CATEGORY = 9;
const WORK_ORDERS_CLOSED_CATEGORY = 6;

const actionsByDaySelector = state => state.cityWork.actionsByDay;
const ticketsSelector = state => state.cityWork.tickets;
const typesByIdSelector = state => state.cityWork.typesById;
const exploreDataCacheSelector = state => state.cityWork.exploreDataCache;
const exploreDataKeySelector = state => state.cityWork.exploreDataKey;

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

export const getMapData = createSelector(
  [exploreDataCacheSelector, exploreDataKeySelector, typesByIdSelector],
  (exploreDataCache, exploreDataKey, typesById) => {
    let selection = [];
    if (
      exploreDataCache &&
      exploreDataKey &&
      exploreDataCache[exploreDataKey]
    ) {
      selection = exploreDataCache[exploreDataKey].map(ticket => ({
        id: ticket.id,
        latitude: ticket.latitude,
        longitude: ticket.longitude,
        title: typesById[ticket.type] ? typesById[ticket.type].name : '',
        date: format(parseISO(ticket.last_modified), 'yyyy-MM-dd'),
        type: typesById[ticket.type]
      }));
    }
    return selection;
  }
);

// TODO: genericize this
const createDateBuckets = ({ startDate, endDate, categories }) => {
  const set = {};
  const start = startOfDay(parseISO(startDate));
  const end = startOfDay(parseISO(endDate));
  const size = differenceInDays(end, start);

  for (let i = size; i >= 0; i--) {
    set[format(subDays(end, i), SOCRATA_TIMESTAMP)] = categories.reduce(
      (memo, category) => ({ ...memo, [category]: [] }),
      {}
    );
  }
  return set;
};

export const getChartData = createSelector(
  [exploreDataCacheSelector, exploreDataKeySelector, typesByIdSelector],
  (exploreDataCache, exploreDataKey, typesById) => {
    let data = { data: [], columns: [] };
    if (
      exploreDataCache &&
      exploreDataKey &&
      exploreDataCache[exploreDataKey]
    ) {
      const { categories, dateRange } = JSON.parse(exploreDataKey);
      let ticketsByDay = createDateBuckets({
        ...dateRange,
        categories: categories.map(category => typesById[category].name)
      });
      const orderedDates = Object.keys(ticketsByDay).sort((a, b) => {
        return isBefore(parseISO(a), parseISO(b));
      });

      exploreDataCache[exploreDataKey].forEach(ticket => {
        const dateKey = format(
          startOfDay(parseISO(ticket.last_modified)),
          SOCRATA_TIMESTAMP
        );
        const type = typesById[ticket.type];
        ticketsByDay[dateKey][type.name].push(ticket);
      });
      data.columns = orderedDates;
      data.data = orderedDates.reduce((memo, day) => {
        const ticketsForDay = ticketsByDay[day];
        const counts = Object.keys(ticketsForDay).reduce(
          (memo, type) => ({
            ...memo,
            [type]: ticketsForDay[type].length
          }),
          {}
        );
        return [
          ...memo,
          {
            ...counts,
            date: parseISO(day)
          }
        ];
      }, []);
    }
    return data;
  }
);

export const getCategoryNames = createSelector(
  [exploreDataKeySelector, typesByIdSelector],
  (exploreDataKey, typesById) => {
    let selection = [];
    if (exploreDataKey && typesById) {
      const { categories } = JSON.parse(exploreDataKey);
      const names = categories.map(cat => typesById[cat].name);
      const last = names.pop();
      return `${names.join(', ')}, and ${last}`;
    }
    return selection;
  }
);
