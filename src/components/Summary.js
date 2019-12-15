import React from 'react';

import WorkOrderChart from 'components/WorkOrderChart';
import WeeklyTrendsAll from 'components/WeeklyTrendsAll';
import { BlockContent, DataCol } from 'components/DataBlock';

const Summary = () => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <div className="row">
      <DataCol>
        <WorkOrderChart />
      </DataCol>
      <WeeklyTrendsAll />
    </div>
  </BlockContent>
);

export default Summary;
