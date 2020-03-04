import parseISO from 'date-fns/parseISO';
import startOfYesterday from 'date-fns/startOfYesterday';
import endOfYesterday from 'date-fns/endOfYesterday';

import { SOCRATA_DATASETS, DATE_PRESETS } from 'data/Constants';
import { instance, formatURL, constructDateRangeQuery } from 'data/api';

// https://data.somervillema.gov/resource/754v-8e35.json?$where=(date+%3E%3D+%272020-03-01T00:00:00.000%27+and+date+%3C+%272020-03-01T23:59:59.999%27)
export const getWebsiteDailyTotals = async () => {
  const dateRange = constructDateRangeQuery({
    startDate: startOfYesterday(),
    endDate: endOfYesterday(),
    dateField: 'date'
  });
  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Analytics), {
    params: {
      $where: `${dateRange}`,
      $order: 'pageviews DESC'
    }
  });
};

// https://data.somervillema.gov/resource/754v-8e35.json?$select=avg(pageviews),+url&$where=(date+%3E%3D+%272019-03-03T00:00:00.000%27+and+date+%3C+%272020-03-01T23:59:59.999%27)&$group=url
export const getWebsiteAverages = async () => {
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(DATE_PRESETS['1 year'].startDate),
    endDate: parseISO(DATE_PRESETS['1 year'].endDate),
    dateField: 'date'
  });
  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Analytics), {
    params: {
      $select: 'sum(pageviews), date',
      $where: `${dateRange}`,
      $group: 'date'
    }
  });
};
