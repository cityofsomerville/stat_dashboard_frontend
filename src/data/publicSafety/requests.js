import parseISO from 'date-fns/parseISO';
import startOfYesterday from 'date-fns/startOfYesterday';
import endOfYesterday from 'date-fns/endOfYesterday';

import { SOCRATA_DATASETS, DATE_PRESETS } from 'data/Constants';
import { instance, formatURL, constructDateRangeQuery } from 'data/api';

// FIXME after the demo!!
const dayRange = {
  // startDate: startOfYesterday(),
  // endDate: endOfYesterday()
  startDate: parseISO('2019-10-07T00:00:00.000'),
  endDate: parseISO('2019-10-07T23:59:59.999')
};

export const getQOLCount = async () => {
  const dateRange = constructDateRangeQuery({
    ...dayRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_QualityOfLife),
    {
      params: {
        $select: 'count(*) as count',
        $where: `${dateRange}`
      }
    }
  );
};

export const getCICount = async () => {
  const dateRange = constructDateRangeQuery({
    ...dayRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_CriminalIncidents),
    {
      params: {
        $select: 'count(*) as count',
        $where: `${dateRange}`
      }
    }
  );
};

export const getTECount = async () => {
  const dateRange = constructDateRangeQuery({
    ...dayRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_TrafficEnforcement),
    {
      params: {
        $select: 'count(*) as count',
        $where: `${dateRange}`
      }
    }
  );
};

export const getMVCCount = async () => {
  const dateRange = constructDateRangeQuery({
    ...dayRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_MotorVehicleCitations),
    {
      params: {
        $select: 'count(*) as count',
        $where: `${dateRange}`
      }
    }
  );
};
