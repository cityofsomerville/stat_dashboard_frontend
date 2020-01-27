import { createSelector } from 'reselect';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import {
  getStackedAreaChartData,
  selectionTypes,
  legendData,
  groupBy
} from 'data/utils';

const dailyTotalsSelector = state => state.publicSafety.dailyTotals;
const typeAveragesSelector = state => state.publicSafety.typeAverages;
const exploreDataCacheSelector = state => state.publicSafety.exploreDataCache;
const exploreDataParamsSelector = state => state.publicSafety.exploreDataParams;

export const getPublicSafetyKeyMetrics = createSelector(
  [dailyTotalsSelector, typeAveragesSelector],
  (dailyTotals, typeAverages) => {
    let metrics = {
      qol: { figure: null, average: null },
      ci: { figure: null, average: null },
      mvc: { figure: null, average: null },
      te: { figure: null, average: null }
    };
    Object.keys(dailyTotals).forEach(key => {
      metrics[key].figure = dailyTotals[key];
    });
    Object.keys(typeAverages).forEach(key => {
      metrics[key].average = typeAverages[key];
    });
    return metrics;
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

export const getCategoryNames = createSelector(
  exploreDataCacheSelector,
  exploreDataCache => {
    return Object.keys(groupBy(exploreDataCache, 'type'));
  }
);

const getSelectionTypes = createSelector(
  [exploreDataCacheSelector, getCategoryNames],
  selectionTypes
);

export const getLegendData = createSelector(getSelectionTypes, legendData);

export const getChartData = createSelector(
  [exploreDataCacheSelector, getParams, getCategoryNames],
  (permits, params, categoryNames) =>
    getStackedAreaChartData(
      permits,
      { ...params, categories: categoryNames },
      'date'
    )
);

export const getMapData = createSelector(
  [exploreDataCacheSelector, exploreDataParamsSelector, getSelectionTypes],
  (exploreDataCache, exploreDataParams, selectionTypes) => {
    let selection = [];
    if (exploreDataCache && exploreDataParams) {
      selection = exploreDataCache.map(incident => ({
        id: incident.id,
        latitude: incident.latitude,
        longitude: incident.longitude,
        title: incident.type,
        date: format(parseISO(incident.date), 'yyyy-MM-dd'),
        type: incident.type,
        color: selectionTypes[incident.type].color
      }));
      selection = selection.filter(
        incident => incident.latitude && incident.longitude
      );
    }
    return selection;
  }
);
