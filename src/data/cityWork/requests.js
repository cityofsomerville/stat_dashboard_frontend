import parseISO from 'date-fns/parseISO';

import { SOCRATA_DATASETS } from 'data/Constants';
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
    dateField: 'last_modified'
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
