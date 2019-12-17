import subDays from 'date-fns/subDays';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';
import startOfToday from 'date-fns/startOfToday';

export const getWeeklyTrends = (types, tickets) => {
  let weeklyTrends = [];
  const startOfWeek = subDays(startOfToday(), 7);
  const upsertTicket = (bucket, ticket) => {
    if (!bucket[ticket.type]) {
      bucket[ticket.type] = [];
    }
    bucket[ticket.type].push(ticket);
  };

  if (Object.keys(types).length && tickets.length) {
    const ticketsByWeek = tickets.reduce(
      (memo, ticket) => {
        if (isBefore(parseISO(ticket.last_modified), startOfWeek)) {
          upsertTicket(memo.lastWeek, ticket);
        } else {
          upsertTicket(memo.thisWeek, ticket);
        }
        return memo;
      },
      { lastWeek: {}, thisWeek: {} }
    );
    weeklyTrends = Object.keys(ticketsByWeek.thisWeek)
      .map(key => {
        const thisWeekCount = ticketsByWeek.thisWeek[key].length;
        const lastWeekCount = ticketsByWeek.lastWeek[key]
          ? ticketsByWeek.lastWeek[key].length
          : 0;
        return {
          trend: Math.round(
            ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100
          ),
          countIncrease: thisWeekCount - lastWeekCount,
          label: types[key].name,
          type: key,
          ancestor: types[key].ancestor_id,
          thisWeekCount,
          lastWeekCount
        };
      })
      .sort((a, b) => b.countIncrease - a.countIncrease)
      .slice(0, 3);
  }
  return weeklyTrends;
};
