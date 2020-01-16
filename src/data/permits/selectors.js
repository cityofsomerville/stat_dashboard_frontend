import { createSelector } from 'reselect';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { getStackedAreaChartData } from 'data/utils';

const dailyTotalsSelector = state => state.permits.dailyTotals;
const typeAveragesSelector = state => state.permits.typeAverages;
const exploreDataCacheSelector = state => state.permits.exploreDataCache;
const exploreDataParamsSelector = state => state.permits.exploreDataParams;

export const getPermitsKeyMetrics = createSelector(
  [dailyTotalsSelector, typeAveragesSelector],
  (dailyTotals, typeAverages) => {
    let metrics = {
      'Residential Building': { figure: null, average: null },
      'Commercial Building': { figure: null, average: null }
    };
    if (dailyTotals) {
      Object.keys(metrics).forEach(type => {
        if (dailyTotals[type]) {
          metrics[type].figure = Number(dailyTotals[type].count);
        } else {
          metrics[type].figure = 0;
        }
        if (typeAverages[type]) {
          metrics[type].average = Number(typeAverages[type].daily_average);
        }
      });
    }

    return Object.keys(metrics).map(type => ({
      ...metrics[type],
      type: type.toLowerCase()
    }));
  }
);

const getParams = createSelector(
  [exploreDataParamsSelector],
  exploreDataParams => {
    let data = { categories: [], dateRange: {} };
    if (exploreDataParams) {
      const { categories, dateRange } = JSON.parse(exploreDataParams);
      data.categories = categories;
      data.dateRange = {
        startDate: parseISO(dateRange.startDate),
        endDate: parseISO(dateRange.endDate)
      };
    }
    return data;
  }
);

export const getChartData = createSelector(
  [exploreDataCacheSelector, getParams],
  (permits, params) => getStackedAreaChartData(permits, params, 'issue_date')
);

export const getMapData = createSelector(
  [exploreDataCacheSelector, exploreDataParamsSelector],
  (exploreDataCache, exploreDataParams) => {
    let selection = [];
    if (exploreDataCache && exploreDataParams) {
      selection = exploreDataCache.map(permit => ({
        id: permit.id,
        latitude: permit.latitude,
        longitude: permit.longitude,
        title: permit.id,
        amount: permit.amount,
        date: format(parseISO(permit.issue_date), 'yyyy-MM-dd'),
        type: permit.type
      }));
    }
    return selection;
  }
);

export const getCategoryNames = createSelector(getParams, params => {
  return params.categories;
});
