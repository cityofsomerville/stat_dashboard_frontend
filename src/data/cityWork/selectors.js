import { createSelector } from 'reselect';
import format from 'date-fns/format';
import startOfYesterday from 'date-fns/startOfYesterday';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';

import { isServiceRequest } from 'data/BaseCategories';
import { groupBy, formatTimestamp, dateRangeBuckets } from 'data/utils';

const WORK_ORDERS_CREATED_CATEGORY = 9;
const WORK_ORDERS_CLOSED_CATEGORY = 6;

const actionsByDaySelector = state => state.cityWork.actionsByDay;
const ticketsSelector = state => state.cityWork.tickets;
const typesByIdSelector = state => state.cityWork.typesById;
const exploreDataCacheSelector = state => state.cityWork.exploreDataCache;
const exploreDataKeySelector = state => state.cityWork.exploreDataKey;
const weeklyTrendsSelector = state => state.cityWork.weeklyTrends;

export const getWorkOrders = createSelector(
  actionsByDaySelector,
  actionsByDay => {
    let metrics = {
      created: { figure: null, delta: null },
      closed: { figure: null, delta: null }
    };

    const yesterday = actionsByDay[formatTimestamp(startOfYesterday())];

    const twoDaysAgo =
      actionsByDay[formatTimestamp(subDays(startOfYesterday(), 1))];

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
        isAfter(parseISO(ticket.last_modified), startOfYesterday())
    ).length;

    const callsTwoDaysAgo = tickets.filter(ticket => {
      const ticketDate = parseISO(ticket.last_modified);
      return (
        ticket.origin === 'Call Center' &&
        isBefore(ticketDate, startOfYesterday()) &&
        isAfter(ticketDate, subDays(startOfYesterday(), 1))
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
      return differenceInDays(parseISO(a), parseISO(b));
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

export const getMapData = createSelector(
  [exploreDataCacheSelector, exploreDataKeySelector, typesByIdSelector],
  (exploreDataCache, exploreDataKey, typesById) => {
    let selection = [];
    if (exploreDataCache && exploreDataKey) {
      selection = exploreDataCache.map(ticket => ({
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
    set[formatTimestamp(subDays(end, i))] = categories.reduce(
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
    if (exploreDataCache && exploreDataKey) {
      const { categories, dateRange } = JSON.parse(exploreDataKey);
      let ticketsByDay = dateRangeBuckets({
        startDate: parseISO(dateRange.startDate),
        endDate: parseISO(dateRange.endDate)
      });

      Object.keys(ticketsByDay).forEach(key => {
        ticketsByDay[key] = categories.reduce(
          (memo, category) => ({
            ...memo,
            [typesById[category].name]: 0
          }),
          {}
        );
      });

      const orderedDates = Object.keys(ticketsByDay).sort((a, b) => {
        return differenceInDays(parseISO(a), parseISO(b));
      });

      exploreDataCache.forEach(ticket => {
        const dateKey = formatTimestamp(
          startOfDay(parseISO(ticket.created_on))
        );
        const type = typesById[ticket.type];
        ticketsByDay[dateKey][type.name]++;
      });
      data.columns = orderedDates;
      data.data = orderedDates.map(day => ({
        ...ticketsByDay[day],
        date: parseISO(day)
      }));
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

export const getAllWeeklyTrends = createSelector(
  weeklyTrendsSelector,
  weeklyTrends => weeklyTrends.slice(0, 3)
);

export const getInternalWeeklyTrends = createSelector(
  weeklyTrendsSelector,
  weeklyTrends => {
    let selection = [];
    if (weeklyTrends) {
      selection = weeklyTrends
        .filter(trend => isServiceRequest(trend.type))
        .slice(0, 3);
    }
    return selection;
  }
);

export const getInternalTreemapData = createSelector(
  weeklyTrendsSelector,
  weeklyTrends => {
    let data = {};
    const byDept = groupBy(
      weeklyTrends.filter(trend => isServiceRequest(trend.type)),
      'dept'
    );

    data = Object.keys(byDept).map(key => {
      return {
        name: key,
        value: byDept[key].reduce(
          (memo, category) => memo + category.thisWeekCount,
          0
        )
      };
    });

    return data;
  }
);
