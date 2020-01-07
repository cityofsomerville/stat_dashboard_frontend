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
