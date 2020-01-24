import startOfDay from 'date-fns/startOfDay';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import subDays from 'date-fns/subDays';

import { SOCRATA_TIMESTAMP } from 'data/Constants';

export const formatTimestamp = date => format(date, SOCRATA_TIMESTAMP);

export const indexBy = (arr, index) =>
  arr.reduce(
    (memo, item) => ({
      ...memo,
      [item[index]]: item
    }),
    {}
  );

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

export const getStackedAreaChartData = (data, params, dateField) => {
  let chartData = { data: [], columns: [] };
  if (data && params) {
    const { categories, dateRange } = params;
    let dataByDay = {};
    const range = getDateRange(dateRange);

    range.forEach(key => {
      dataByDay[key] = categories.reduce(
        (memo, category) => ({
          ...memo,
          [category]: 0
        }),
        {}
      );
    });

    data.forEach(ticket => {
      const dateKey = formatTimestamp(startOfDay(parseISO(ticket[dateField])));
      dataByDay[dateKey][ticket.type]++;
    });
    chartData.columns = range;
    chartData.data = range.map(day => ({
      ...dataByDay[day],
      date: parseISO(day)
    }));
  }
  return chartData;
};

export const legendData = types =>
  Object.keys(types)
    .map(id => types[id])
    .sort((a, b) => b.count - a.count);
