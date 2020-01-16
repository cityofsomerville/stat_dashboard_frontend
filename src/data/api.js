import axios from 'axios';

import { formatTimestamp } from 'data/utils';

export const instance = axios.create({
  baseURL: 'https://data.somervillema.gov'
});

export const formatURL = dataset => `/resource/${dataset}.json`;

export const constructDateRangeQuery = ({ startDate, endDate, dateField }) =>
  `(${dateField} >= '${formatTimestamp(
    startDate
  )}' and ${dateField} < '${formatTimestamp(endDate)}')`;
