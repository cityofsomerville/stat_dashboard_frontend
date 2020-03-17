import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import ChartContainer from 'charts/ChartContainer';
import StackedAreaChart from 'charts/StackedAreaChart';
import { fetchBacklogData } from 'data/cityWork/actions';
import { getBacklogData } from 'data/cityWork/selectors';
import Legend from 'components/Legend';

const InternalWork = ({ fetchBacklogData, backlogData }) => {
  useEffect(() => {
    fetchBacklogData();
  }, [fetchBacklogData]);

  return (
    <BlockContent>
      <p>
        This chart shows the city's backlog of open work orders per day over the
        past 365 days.
      </p>
      <DataRow>
        <DataCol>
          <ChartContainer
            chartClass={StackedAreaChart}
            data={backlogData}
            name="backlog"
            cachebust={backlogData}
          />
          <Legend legendData={backlogData.legendData} />
        </DataCol>
      </DataRow>
    </BlockContent>
  );
};

export default connect(
  state => ({
    backlogData: getBacklogData(state)
  }),
  { fetchBacklogData }
)(InternalWork);
