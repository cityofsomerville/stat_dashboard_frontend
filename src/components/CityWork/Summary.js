import React from 'react';
import { connect } from 'react-redux';

import WeeklyTrendsAll from 'components/CityWork/WeeklyTrendsAll';
import { BlockContent, DataCol, DataRow } from 'components/DataBlock';
import ChartContainer from 'charts/ChartContainer';
import GroupedBarChart from 'charts/GroupedBarChart';
import { getWorkOrderChartData } from 'data/cityWork/selectors';

const Summary = ({ chartData }) => (
  <BlockContent>
    <DataRow>
      <DataCol>
        <h3>Work Orders this Week</h3>
        <ChartContainer
          chartClass={GroupedBarChart}
          data={chartData}
          columns={chartData.columns}
          name="workOrderChart"
          cachebust={chartData}
        />
      </DataCol>
      <WeeklyTrendsAll />
    </DataRow>
  </BlockContent>
);

export default connect(state => ({
  chartData: getWorkOrderChartData(state)
}))(Summary);
