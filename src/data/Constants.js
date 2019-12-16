import subDays from 'date-fns/subDays';
import startOfToday from 'date-fns/startOfToday';
import endOfYesterday from 'date-fns/endOfYesterday';

export const SOCRATA_DATASETS = {
  Somerville_Services: '4pyi-uqq6',
  Somerville_Services_Activities: 'f7b7-bfkg',
  Somerville_Services_Types: 'ikh2-c6hz',
  Somerville_Permits: 'vxgw-vmky'
};

export const SOCRATA_TIMESTAMP = "yyyy-MM-dd'T'HH:mm:ss.SSS";

export const DATE_PRESETS = {
  '7 days': { startDate: subDays(startOfToday, 7), endDate: endOfYesterday() },
  '30 days': {
    startDate: subDays(startOfToday, 30),
    endDate: endOfYesterday()
  },
  '3 months': {
    startDate: subDays(startOfToday, 90),
    endDate: endOfYesterday()
  },
  '1 year': {
    startDate: subDays(startOfToday, 365),
    endDate: endOfYesterday()
  },
  'Custom...': {
    startDate: subDays(startOfToday, 7),
    endDate: endOfYesterday()
  }
};
