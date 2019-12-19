import { createSelector } from 'reselect';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import startOfYesterday from 'date-fns/startOfYesterday';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';

import { SOCRATA_TIMESTAMP } from 'data/Constants';
import { isServiceRequest } from 'data/BaseCategories';

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
        return differenceInDays(parseISO(a), parseISO(b));
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

const groupBy = (arr, index) =>
  arr.reduce((memo, item) => {
    if (!memo[item[index]]) {
      memo[item[index]] = [];
    }
    memo[item[index]].push(item);
    return memo;
  }, {});

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
        // children: byDept[key].map(category => ({
        //   name: category.label,
        //   value: category.thisWeekCount
        // }))
        value: byDept[key].reduce(
          (memo, category) => memo + category.thisWeekCount,
          0
        )
      };
    });

    // [
    //   name: 'Dept',
    //   children: [all tickets for that dept]
    // ]
    console.log(data);
    return data;
  }
);
