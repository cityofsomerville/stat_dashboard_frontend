import axios from 'axios';
import format from 'date-fns/format';

export const instance = axios.create({
  baseURL: 'https://data.somervillema.gov'
});

export const formatURL = dataset => `/resource/${dataset}.json`;

const formatTimestamp = date => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");

export const constructDateRangeQuery = ({ startDate, endDate, dateField }) =>
  `(${dateField} >= '${formatTimestamp(
    startDate
  )}' and ${dateField} < '${formatTimestamp(endDate)}')`;
