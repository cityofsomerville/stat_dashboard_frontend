import axios from 'axios';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { SOCRATA_DATASETS } from 'data/Constants';

const instance = axios.create({
  baseURL: 'https://data.somervillema.gov'
});

const formatURL = dataset => `/resource/${dataset}.json`;

const formatTimestamp = date => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");

const constructDateRangeQuery = ({ startDate, endDate, dateField }) =>
  `(${dateField} >= '${formatTimestamp(
    startDate
  )}' and ${dateField} < '${formatTimestamp(endDate)}')`;

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
