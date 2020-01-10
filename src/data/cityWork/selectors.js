import { createSelector } from 'reselect';
import format from 'date-fns/format';
import startOfYesterday from 'date-fns/startOfYesterday';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';

import { groupBy, formatTimestamp, getStackedAreaChartData } from 'data/utils';
import { BaseCategories, isServiceRequest } from 'data/BaseCategories';

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

const getTicketsWithCategories = createSelector(
  [exploreDataCacheSelector, typesByIdSelector],
  (exploreDataCache, typesById) => {
    let tickets = [];
    if (exploreDataCache && typesById) {
      tickets = exploreDataCache.map(ticket => ({
        ...ticket,
        type: typesById[ticket.type].name
      }));
    }
    return tickets;
  }
);

const getParams = createSelector(
  [exploreDataKeySelector, typesByIdSelector],
  (exploreDataKey, typesById) => {
    let data = { categories: [], dateRange: {} };
    if (exploreDataKey && typesById) {
      const { categories, dateRange } = JSON.parse(exploreDataKey);
      data.categories = categories.map(category => typesById[category].name);
      data.dateRange = {
        startDate: parseISO(dateRange.startDate),
        endDate: parseISO(dateRange.endDate)
      };
    }
    return data;
  }
);

export const getChartData = createSelector(
  [getTicketsWithCategories, getParams],
  (tickets, params) => getStackedAreaChartData(tickets, params, 'created_on')
);

export const getCategoryNames = createSelector(getParams, params => {
  return params.categories;
});

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

export const getInProgressHeatmapData = createSelector(
  ticketsSelector,
  tickets => {
    // const types = Object.keys(BaseCategories).map()
    // const types = tickets.reduce(ticket => {
    //   if (!memo.indexOf(ticket.)) {
    //   }
    //   return memo;
    // }, []);
    // let ticketsByDay = createDateBuckets({
    //   ...dateRange,
    //   categories: categories.map(category => typesById[category].name)
    // });
  }
);
