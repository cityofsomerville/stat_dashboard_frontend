import axios from 'axios';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import startOfYesterday from 'date-fns/startOfYesterday';
import endOfYesterday from 'date-fns/endOfYesterday';

import { SOCRATA_DATASETS, DATE_PRESETS } from 'data/Constants';
import { instance, formatURL, constructDateRangeQuery } from 'data/api';

export const getPermitsExploreData = async key => {
  const properties = JSON.parse(key);
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(properties.dateRange.startDate),
    endDate: parseISO(properties.dateRange.endDate),
    dateField: 'issue_date'
  });
  const typeSelection = properties.categories
    .map(type => `type = "${type}"`)
    .join(' or ');

  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Permits), {
    params: {
      $where: `${dateRange} and (${typeSelection})`,
      $limit: 10000
    }
  });
};

// https://data.somervillema.gov/resource/vxgw-vmky.json?$select=(count(*)) as count,type&$where=(issue_date >= '2020-01-08T00:00:00.000' and issue_date < '2020-01-15T23:59:59.999')&$group=type
export const getDailyTotals = async () => {
  const dateRange = constructDateRangeQuery({
    startDate: startOfYesterday(),
    endDate: endOfYesterday(),
    dateField: 'issue_date'
  });
  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Permits), {
    params: {
      $select: 'type, count(*) as count',
      $where: `${dateRange}`,
      $group: 'type'
    }
  });
};

// https://data.somervillema.gov/resource/vxgw-vmky.json?$select=(count(*)/365) as count,type&$where=(issue_date >= '2019-01-05T00:00:00.000' and issue_date < '2020-01-15T23:59:59.999')&$group=type
export const getTypeAverages = async () => {
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(DATE_PRESETS['1 year'].startDate),
    endDate: parseISO(DATE_PRESETS['1 year'].endDate),
    dateField: 'issue_date'
  });
  return await instance.get(formatURL(SOCRATA_DATASETS.Somerville_Permits), {
    params: {
      $select: 'type, (count(*)/365) as daily_average',
      $where: `${dateRange}`,
      $group: 'type'
    }
  });
};
