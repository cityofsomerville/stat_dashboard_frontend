import React from 'react';

import WorkOrderChart from 'components/CityWork/WorkOrderChart';
import WeeklyTrendsAll from 'components/CityWork/WeeklyTrendsAll';
import { BlockContent, DataCol, DataRow } from 'components/DataBlock';

const Summary = () => (
  <BlockContent>
    <DataRow>
      <DataCol>
        <h3>Work Orders this Week</h3>
        <WorkOrderChart />
      </DataCol>
      <WeeklyTrendsAll />
    </DataRow>
  </BlockContent>
);

export default Summary;
