import { groupBy } from 'data/utils';

export const getWeeklyTrends = (types, tickets, averages) => {
  let weeklyTrends = [];
  const ticketsByType = groupBy(tickets, 'type');

  weeklyTrends = Object.keys(ticketsByType)
    .map(typeId => {
      const average = Number(averages[typeId].weekly_average);
      const count = ticketsByType[typeId].length;
      const ancestor = types[typeId].ancestor_id;

      return {
        trend: Math.round(((count - average) / average) * 100),
        label: types[typeId].name,
        type: typeId,
        ancestorName: types[ancestor],
        dept: ticketsByType[typeId][0].dept,
        ancestor,
        average,
        count
      };
    })
    .sort((a, b) => b.trend - a.trend);

  return weeklyTrends;
};
