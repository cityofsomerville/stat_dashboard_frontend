import parseISO from 'date-fns/parseISO';

import { SOCRATA_DATASETS, DATE_PRESETS } from 'data/Constants';
import { instance, formatURL, constructDateRangeQuery } from 'data/api';

export const getTickets = async ({ startDate, endDate }) => {
  const dateRange = constructDateRangeQuery({
    startDate,
    endDate,
    dateField: 'last_modified'
  });

  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Services), {
    params: {
      $where: dateRange,
      $limit: 10000
    }
  });
};

export const getActions = async ({ startDate, endDate }) => {
  const dateRange = constructDateRangeQuery({
    startDate,
    endDate,
    dateField: 'action_date'
  });

  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_Services_Activities),
    {
      params: {
        $select:
          'date_trunc_ymd(action_date) AS action_day, code, action_date, request_id',
        $where: `${dateRange} and (code = 6 or code = 9)`,
        $limit: 10000
      }
    }
  );
};

export const getTypes = async () => {
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_Services_Types)
  );
};

export const getCityWorkExploreData = async key => {
  const properties = JSON.parse(key);
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(properties.dateRange.startDate),
    endDate: parseISO(properties.dateRange.endDate),
    dateField: 'created_on'
  });
  const typeSelection = properties.categories
    .map(id => `type = "${id}"`)
    .join(' or ');
  const statusSelection = `status = "Closed"`;

  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Services), {
    params: {
      $where: `${dateRange} and (${typeSelection}) and (${statusSelection})`,
      $limit: 10000
    }
  });
};

// https://data.somervillema.gov/resource/f7b7-bfkg.json?$select=(count(*)/365) as daily_average,codeDesc&$group=codeDesc&$where=(action_date >= '2019-01-16T00:00:00.000' and action_date < '2020-01-16T23:59:59.999')
export const getDailyAveragePerAction = async () => {
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(DATE_PRESETS['1 year'].startDate),
    endDate: parseISO(DATE_PRESETS['1 year'].endDate),
    dateField: 'action_date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_Services_Activities),
    {
      params: {
        $select: '(count(*)/365) as daily_average,codeDesc',
        $where: `${dateRange}`,
        $group: 'codeDesc',
        $limit: 10000
      }
    }
  );
};

// https://data.somervillema.gov/resource/4pyi-uqq6.json?$select=type,(count(*)/52) as weekly_average&$group=type
export const getWeeklyAveragePerType = async () => {
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(DATE_PRESETS['1 year'].startDate),
    endDate: parseISO(DATE_PRESETS['1 year'].endDate),
    dateField: 'created_on'
  });
  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Services), {
    params: {
      $select: 'type,(count(*)/52) as weekly_average',
      $where: `${dateRange}`,
      $group: 'type',
      $limit: 10000
    }
  });
};
