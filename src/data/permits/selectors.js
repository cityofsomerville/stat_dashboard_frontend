import { createSelector } from 'reselect';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const exploreDataCacheSelector = state => state.permits.exploreDataCache;
const exploreDataParamsSelector = state => state.permits.exploreDataParams;

// export const getChartData = createSelector(
//   [exploreDataCacheSelector, exploreDataKeySelector],
//   (exploreDataCache, exploreDataKey, typesById) => {
//     let data = { data: [], columns: [] };
//     if (
//       exploreDataCache &&
//       exploreDataKey &&
//       exploreDataCache[exploreDataKey]
//     ) {
//       const { categories, dateRange } = JSON.parse(exploreDataKey);
//       let permitsByDay = createDateBuckets({
//         ...dateRange,
//         categories
//       });
//       const orderedDates = Object.keys(ticketsByDay).sort((a, b) => {
//         return differenceInDays(parseISO(a), parseISO(b));
//       });

//       exploreDataCache[exploreDataKey].forEach(ticket => {
//         const dateKey = format(
//           startOfDay(parseISO(ticket.last_modified)),
//           SOCRATA_TIMESTAMP
//         );
//         const type = typesById[ticket.type];
//         ticketsByDay[dateKey][type.name].push(ticket);
//       });
//       data.columns = orderedDates;
//       data.data = orderedDates.reduce((memo, day) => {
//         const ticketsForDay = ticketsByDay[day];
//         const counts = Object.keys(ticketsForDay).reduce(
//           (memo, type) => ({
//             ...memo,
//             [type]: ticketsForDay[type].length
//           }),
//           {}
//         );
//         return [
//           ...memo,
//           {
//             ...counts,
//             date: parseISO(day)
//           }
//         ];
//       }, []);
//     }
//     return data;
//   }
// );

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
    console.log(selection);
    return selection;
  }
);
