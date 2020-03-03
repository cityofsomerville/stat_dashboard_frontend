import parseISO from 'date-fns/parseISO';
import startOfYesterday from 'date-fns/startOfYesterday';
import endOfYesterday from 'date-fns/endOfYesterday';

import { SOCRATA_DATASETS, DATE_PRESETS } from 'data/Constants';
import { instance, formatURL, constructDateRangeQuery } from 'data/api';

const dayRange = {
  startDate: startOfYesterday(),
  endDate: endOfYesterday()
};

const yearRange = {
  startDate: parseISO(DATE_PRESETS['1 year'].startDate),
  endDate: parseISO(DATE_PRESETS['1 year'].endDate)
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

export const getQOLAverage = async () => {
  const dateRange = constructDateRangeQuery({
    ...yearRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_QualityOfLife),
    {
      params: {
        $select: '(count(*)/365) as daily_average',
        $where: `${dateRange}`
      }
    }
  );
};

export const getQOLExploreData = async params => {
  const properties = JSON.parse(params);
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(properties.dateRange.startDate),
    endDate: parseISO(properties.dateRange.endDate),
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_QualityOfLife),
    {
      params: {
        $select: 'id,latitude,longitude,date,inctype as type',
        $where: `${dateRange}`,
        $limit: 10000
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

export const getCIAverage = async () => {
  const dateRange = constructDateRangeQuery({
    ...yearRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_CriminalIncidents),
    {
      params: {
        $select: '(count(*)/365) as daily_average',
        $where: `${dateRange}`
      }
    }
  );
};

export const getCIExploreData = async params => {
  const properties = JSON.parse(params);
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(properties.dateRange.startDate),
    endDate: parseISO(properties.dateRange.endDate),
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_CriminalIncidents),
    {
      params: {
        $select: 'id,latitude,longitude,date,offense as type',
        $where: `${dateRange}`,
        $limit: 10000
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

export const getTEAverage = async () => {
  const dateRange = constructDateRangeQuery({
    ...yearRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_TrafficEnforcement),
    {
      params: {
        $select: '(count(*)/365) as daily_average',
        $where: `${dateRange}`
      }
    }
  );
};

export const getTEExploreData = async params => {
  const properties = JSON.parse(params);
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(properties.dateRange.startDate),
    endDate: parseISO(properties.dateRange.endDate),
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_TrafficEnforcement),
    {
      params: {
        $select: 'id,latitude,longitude,date,inctype as type',
        $where: `${dateRange}`,
        $limit: 10000
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

export const getMVCAverage = async () => {
  const dateRange = constructDateRangeQuery({
    ...yearRange,
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_MotorVehicleCitations),
    {
      params: {
        $select: '(count(*)/365) as daily_average',
        $where: `${dateRange}`
      }
    }
  );
};

export const getMVCExploreData = async params => {
  const properties = JSON.parse(params);
  const dateRange = constructDateRangeQuery({
    startDate: parseISO(properties.dateRange.startDate),
    endDate: parseISO(properties.dateRange.endDate),
    dateField: 'date'
  });
  return await instance.get(
    formatURL(SOCRATA_DATASETS.Somerville_MotorVehicleCitations),
    {
      params: {
        $select: 'id,latitude,longitude,date,chgdesc as type',
        $where: `${dateRange}`,
        $limit: 10000
      }
    }
  );
};
