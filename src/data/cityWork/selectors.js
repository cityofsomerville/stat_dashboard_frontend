import { createSelector } from 'reselect';
import format from 'date-fns/format';
import startOfDay from 'date-fns/startOfDay';
import startOfYesterday from 'date-fns/startOfYesterday';
import endOfYesterday from 'date-fns/endOfYesterday';
import startOfToday from 'date-fns/startOfToday';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';

import {
  groupBy,
  formatTimestamp,
  getStackedAreaChartData,
  getDateRange
} from 'data/utils';
import { BaseCategories, isServiceRequest } from 'data/BaseCategories';

const WORK_ORDERS_CREATED_CATEGORY = 9;
const WORK_ORDERS_CLOSED_CATEGORY = 6;

const actionsByDaySelector = state => state.cityWork.actionsByDay;
const ticketsSelector = state => state.cityWork.tickets;
const typesByIdSelector = state => state.cityWork.typesById;
const exploreDataCacheSelector = state => state.cityWork.exploreDataCache;
const exploreDataKeySelector = state => state.cityWork.exploreDataKey;
const weeklyTrendsSelector = state => state.cityWork.weeklyTrends;
const actionAveragesSelector = state => state.cityWork.actionAverages;
const callsAverageSelector = state => state.cityWork.callsAverage;

export const getWorkOrderCounts = createSelector(
  [actionsByDaySelector, actionAveragesSelector],
  (actionsByDay, actionAverages) => {
    let counts = {
      created: { figure: null, average: null },
      closed: { figure: null, average: null }
    };
    const yesterday = actionsByDay[formatTimestamp(startOfYesterday())];
    if (yesterday && yesterday[WORK_ORDERS_CREATED_CATEGORY].length) {
      counts.created.figure = yesterday[WORK_ORDERS_CREATED_CATEGORY].length;
      counts.closed.figure = yesterday[WORK_ORDERS_CLOSED_CATEGORY].length;
    }
    if (actionAverages && actionAverages['Created']) {
      counts.created.average = actionAverages['Created'].daily_average;
      counts.closed.average = actionAverages['Closed'].daily_average;
    }
    return counts;
  }
);

export const get311CallCounts = createSelector(
  [ticketsSelector, callsAverageSelector],
  (tickets, callsAverage) => {
    let counts = {
      calls: { figure: null, average: null }
    };

    if (tickets.length) {
      const callsYesterday = tickets.filter(
        ticket =>
          ticket.origin === 'Call Center' &&
          isAfter(parseISO(ticket.last_modified), startOfYesterday())
      );
      counts.calls.figure = callsYesterday.length;
    }

    if (callsAverage) {
      counts.calls.average = callsAverage;
    }
    return counts;
  }
);

export const getKeyMetrics = createSelector(
  [getWorkOrderCounts, get311CallCounts],
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
    let dataset = {};
    let maxValue = 0;
    const dateRange = {
      startDate: subDays(startOfToday(), 7),
      endDate: endOfYesterday()
    };
    const dateField = 'created_on';

    const groupedTickets = groupBy(
      tickets.filter(ticket =>
        isAfter(parseISO(ticket[dateField]), dateRange.startDate)
      ),
      'dept' // could also use ancestor here
    );

    const range = getDateRange(dateRange);

    Object.keys(groupedTickets).forEach(dept => {
      const byDay = {};
      range.forEach(day => {
        byDay[day] = [];
      });

      groupedTickets[dept].forEach(ticket => {
        const dateKey = formatTimestamp(
          startOfDay(parseISO(ticket[dateField]))
        );
        byDay[dateKey].push(ticket);
        if (byDay[dateKey].length > maxValue) {
          maxValue = byDay[dateKey].length;
        }
      });

      dataset[dept] = range.map(date => ({
        date: date,
        tickets: byDay[date]
      }));
    });

    return {
      dataset,
      valueRange: [0, maxValue],
      dateRange: range.map(d => parseISO(d))
    };
  }
);
