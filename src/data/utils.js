import startOfDay from 'date-fns/startOfDay';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import subDays from 'date-fns/subDays';

import { SOCRATA_TIMESTAMP } from 'data/Constants';

export const formatTimestamp = date => format(date, SOCRATA_TIMESTAMP);

export const groupBy = (arr, index) =>
  arr.reduce((memo, item) => {
    if (!memo[item[index]]) {
      memo[item[index]] = [];
    }
    memo[item[index]].push(item);
    return memo;
  }, {});

export const getDateRange = ({ startDate, endDate }) => {
  let set = [];
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  const size = differenceInDays(end, start);

  for (let i = size; i >= 0; i--) {
    set.push(formatTimestamp(subDays(end, i)));
  }
  return set;
};

export const dateRangeBuckets = ({ startDate, endDate }) => {
  const set = {};
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  const size = differenceInDays(end, start);

  for (let i = size; i >= 0; i--) {
    set[formatTimestamp(subDays(end, i))] = null;
  }
  return set;
};

export const getStackedAreaChartData = (data, params, dateField) => {
  let chartData = { data: [], columns: [] };
  if (data && params) {
    const { categories, dateRange } = params;
    let dataByDay = dateRangeBuckets(dateRange);

    Object.keys(dataByDay).forEach(key => {
      dataByDay[key] = categories.reduce(
        (memo, category) => ({
          ...memo,
          [category]: 0
        }),
        {}
      );
    });

    const orderedDates = Object.keys(dataByDay).sort((a, b) => {
      return differenceInDays(parseISO(a), parseISO(b));
    });

    data.forEach(ticket => {
      const dateKey = formatTimestamp(startOfDay(parseISO(ticket[dateField])));
      dataByDay[dateKey][ticket.type]++;
    });
    chartData.columns = orderedDates;
    chartData.data = orderedDates.map(day => ({
      ...dataByDay[day],
      date: parseISO(day)
    }));
  }
  return chartData;
};
