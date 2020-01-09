import { createSelector } from 'reselect';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { getStackedAreaChartData } from 'data/utils';

const exploreDataCacheSelector = state => state.permits.exploreDataCache;
const exploreDataParamsSelector = state => state.permits.exploreDataParams;

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
