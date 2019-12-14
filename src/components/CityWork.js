import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import startOfToday from 'date-fns/startOfToday';

import DataBlock, {
  BlockContent,
  WeeklyTrends,
  DataRow,
  DataCol
} from 'components/DataBlock';
import Tabs from 'components/Tabs';
import ExploreData from 'components/ExploreData';
import { getTickets, getActions, getTypes } from 'data/Requests';
import GroupedBarChart from 'charts/GroupedBarChart';

const today = startOfToday();

const bucketByColumn = (set, column, transform) =>
  set.reduce((memo, item) => {
    if (!memo[item[column]]) {
      memo[item[column]] = {};
    }
    if (!memo[item[column]][item.code]) {
      memo[item[column]][item.code] = [];
    }
    memo[item[column]][item.code].push(item);
    return memo;
  }, {});

const typesById = types =>
  types.reduce((memo, type) => {
    return {
      ...memo,
      [type.id]: type
    };
  }, {});

const get311Calls = tickets => {
  return tickets.filter(
    ticket =>
      ticket.origin === 'Call Center' &&
      new Date(ticket.last_modified) > subDays(today, 1)
  );
};

const getWeeklyTrends = (tickets, types) => {
  let weeklyTrends = [];
  const startOfWeek = subDays(today, 7);
  const upsertTicket = (bucket, ticket) => {
    if (!bucket[ticket.type]) {
      bucket[ticket.type] = [];
    }
    bucket[ticket.type].push(ticket);
  };

  if (Object.keys(types).length && tickets.length) {
    const ticketsByWeek = tickets.reduce(
      (memo, ticket) => {
        if (new Date(ticket.last_modified) >= startOfWeek) {
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
          type: types[key].ancestor_id,
          thisWeekCount,
          lastWeekCount
        };
      })
      .sort((a, b) => b.countIncrease - a.countIncrease)
      .slice(0, 3);
  }
  return weeklyTrends;
};

const CityWork = () => {
  const [tickets, setTickets] = useState([]);
  const [actions, setActions] = useState({});
  const [types, setTypes] = useState({});

  let calls311 = null;
  let workOrdersCreated = null;
  let workOrdersClosed = null;
  let weeklyTrends = [];
  let chartData = [];

  useEffect(() => {
    (async () => {
      try {
        const tickets = await getTickets({
          startDate: subDays(today, 14),
          endDate: today
        });
        const actions = await getActions({
          startDate: subDays(today, 7),
          endDate: today
        });
        const types = await getTypes();

        setTickets(tickets);
        setActions(bucketByColumn(actions, 'action_day'));
        setTypes(typesById(types));
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  if (Object.keys(actions).length) {
    workOrdersCreated =
      actions[format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss.SSS")][9].length;
    workOrdersClosed =
      actions[format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss.SSS")][6].length;
    const dates = Object.keys(actions);
    chartData = Object.assign(
      dates.map(date => ({
        Date: format(new Date(date), 'MMM d'),
        'Tickets Opened': actions[date][9].length,
        'Tickets Closed': actions[date][6].length
      })),
      {
        columns: ['Date', 'Tickets Opened', 'Tickets Closed'],
        y: 'Number of Tickets'
      }
    );
  }

  if (tickets.length) {
    calls311 = get311Calls(tickets).length;
    weeklyTrends = getWeeklyTrends(tickets, types);
  }

  return (
    <DataBlock
      heading="City Work"
      keyMetrics={[
        { count: calls311, label: '311 calls', trend: 'positive' },
        {
          count: workOrdersCreated,
          label: 'work orders created',
          trend: 'negative'
        },
        {
          count: workOrdersClosed,
          label: 'work orders closed',
          trend: 'no_change'
        }
      ]}
      introduction="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
            et magnis dis parturient montes, nascetur ridiculus mus."
    >
      <Tabs
        uuid="citywork"
        labels={['Summary', 'Explore Data', 'Internal Work', 'In Progress']}
      >
        <Summary weeklyTrends={weeklyTrends} chartData={chartData} />
        <ExploreData />
        <InternalWork />
        <InProgress />
      </Tabs>
    </DataBlock>
  );
};

class SummaryChart extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.data.length) {
      this.chart = new GroupedBarChart({
        data: this.props.data,
        targetId: 'chart-container'
      });
    }
  }

  render() {
    return <svg id="chart-container" width="800" height="500" />;
  }
}

const Summary = ({ weeklyTrends, chartData }) => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <div className="row">
      <DataCol>
        multi series bar chart showing: total work orders opened and total work
        orders closed by day for the past 7 days
      </DataCol>
      <WeeklyTrends metrics={weeklyTrends} />
    </div>
    <SummaryChart data={chartData} />
  </BlockContent>
);

const InternalWork = () => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <DataRow>
      <DataCol>treemap showing: internally generated work by category</DataCol>
      <WeeklyTrends
        metrics={[
          { trend: 135, label: 'tree pruning/trimming', type: 'forestry' },
          { trend: 77, label: 'sidewalk repair', type: 'dpw' },
          { trend: 19, label: 'pothole', type: 'dpw' }
        ]}
      />
    </DataRow>
  </BlockContent>
);

const InProgress = () => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <DataRow>
      <DataCol>
        scatterplot showing: open tickets by category vs. average time to close
        for that category (workshop this)
      </DataCol>
    </DataRow>
  </BlockContent>
);

export default CityWork;
