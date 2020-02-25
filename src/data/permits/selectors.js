import { createSelector } from 'reselect';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import {
  getStackedAreaChartData,
  selectionTypes,
  legendData,
  groupBy
} from 'data/utils';
import { CHART_COLORS_2 } from 'charts/Constants';

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

export const getCategoryNames = createSelector(getParams, params => {
  return params.categories;
});

const getSelectionTypes = createSelector(
  [exploreDataCacheSelector, getCategoryNames],
  selectionTypes
);

export const getLegendData = createSelector(getSelectionTypes, legendData);

export const getChartData = createSelector(
  [exploreDataCacheSelector, getParams, getSelectionTypes],
  (permits, params, types) =>
    getStackedAreaChartData(permits, params, types, 'issue_date')
);

export const getMapData = createSelector(
  [exploreDataCacheSelector, exploreDataParamsSelector, getSelectionTypes],
  (exploreDataCache, exploreDataParams, selectionTypes) => {
    let selection = [];
    if (exploreDataCache && exploreDataParams) {
      selection = exploreDataCache.map(permit => ({
        id: permit.id,
        latitude: permit.latitude,
        longitude: permit.longitude,
        color: selectionTypes[permit.type].color,
        displayData: {
          Date: format(parseISO(permit.issue_date), 'yyyy-MM-dd'),
          Type: permit.type,
          Amount: `$${permit.amount}`,
          Work: permit.work
        }
      }));
    }
    return selection;
  }
);
