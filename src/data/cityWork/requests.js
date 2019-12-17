import soda from 'soda-js';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { SOCRATA_DATASETS } from 'data/Constants';

const consumer = new soda.Consumer('data.somervillema.gov');

const formatTimestamp = date => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");

const constructDateRangeQuery = ({ startDate, endDate, dateField }) =>
  `${dateField} >= '${formatTimestamp(
    startDate
  )}' and ${dateField} < '${formatTimestamp(endDate)}'`;

export const getTickets = async ({ startDate, endDate }) => {
  const dateRange = constructDateRangeQuery({
    startDate,
    endDate,
    dateField: 'last_modified'
  });

  return await new Promise((resolve, reject) => {
    consumer
      .query()
      .withDataset(SOCRATA_DATASETS.Somerville_Services)
      .where(dateRange)
      .limit(10000)
      .getRows()
      .on('success', resolve)
      .on('error', reject);
  });
};

export const getActions = async ({ startDate, endDate }) => {
  const dateRange = constructDateRangeQuery({
    startDate,
    endDate,
    dateField: 'action_date'
  });

  return await new Promise((resolve, reject) => {
    consumer
      .query()
      .withDataset(SOCRATA_DATASETS.Somerville_Services_Activities)
      .select(
        'date_trunc_ymd(action_date) AS action_day, code, action_date, request_id'
      )
      .where(dateRange)
      .where('code = 6 or code = 9')
      .limit(10000)
      .getRows()
      .on('success', resolve)
      .on('error', reject);
  });
};

export const getTypes = async () => {
  return await new Promise((resolve, reject) => {
    consumer
      .query()
      .withDataset(SOCRATA_DATASETS.Somerville_Services_Types)
      .getRows()
      .on('success', resolve)
      .on('error', reject);
  });
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

  return await new Promise((resolve, reject) => {
    consumer
      .query()
      .withDataset(SOCRATA_DATASETS.Somerville_Services)
      .where(dateRange)
      .where(typeSelection)
      .where('status = "Closed"')
      .getRows()
      .on('success', resolve)
      .on('error', reject);
  });
};
