import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import startOfToday from 'date-fns/startOfToday';
import endOfYesterday from 'date-fns/endOfYesterday';

export const SOCRATA_DATASETS = {
  Somerville_Services: '4pyi-uqq6',
  Somerville_Services_Activities: 'f7b7-bfkg',
  Somerville_Services_Types: 'ikh2-c6hz',
  Somerville_Permits: 'vxgw-vmky',
  Somerville_QualityOfLife: '62z4-avqc',
  Somerville_CriminalIncidents: '9wbi-ck3z',
  Somerville_TrafficEnforcement: '8r94-vs2v',
  Somerville_MotorVehicleCitations: 'cmth-mghs',
  Somerville_Analytics: '754v-8e35'
};

export const SOCRATA_TIMESTAMP = "yyyy-MM-dd'T'HH:mm:ss.SSS";

export const DATE_PRESETS = {
  '7 days': {
    startDate: format(subDays(startOfToday(), 7), SOCRATA_TIMESTAMP),
    endDate: format(endOfYesterday(), SOCRATA_TIMESTAMP)
  },
  '30 days': {
    startDate: format(subDays(startOfToday(), 30), SOCRATA_TIMESTAMP),
    endDate: format(endOfYesterday(), SOCRATA_TIMESTAMP)
  },
  '3 months': {
    startDate: format(subDays(startOfToday(), 90), SOCRATA_TIMESTAMP),
    endDate: format(endOfYesterday(), SOCRATA_TIMESTAMP)
  },
  '1 year': {
    startDate: format(subDays(startOfToday(), 365), SOCRATA_TIMESTAMP),
    endDate: format(endOfYesterday(), SOCRATA_TIMESTAMP)
  },
  'Custom...': {
    startDate: format(subDays(startOfToday(), 7), SOCRATA_TIMESTAMP),
    endDate: format(endOfYesterday(), SOCRATA_TIMESTAMP)
  }
};

export const BASE_URL = 'https://somervillema.gov';
