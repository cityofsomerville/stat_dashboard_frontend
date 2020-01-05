import { createSelector } from 'reselect';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const exploreDataCacheSelector = state => state.permits.exploreDataCache;
const exploreDataKeySelector = state => state.permits.exploreDataKey;

export const getMapData = createSelector(
  [exploreDataCacheSelector, exploreDataKeySelector],
  (exploreDataCache, exploreDataKey, typesById) => {
    let selection = [];
    if (
      exploreDataCache &&
      exploreDataKey &&
      exploreDataCache[exploreDataKey]
    ) {
      selection = exploreDataCache[exploreDataKey].map(permit => ({
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
