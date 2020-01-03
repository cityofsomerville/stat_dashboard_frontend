import React from 'react';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import ChartContainer from 'charts/ChartContainer';
import Heatmap from 'charts/Heatmap';

const InProgress = ({ heatmapData }) => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <DataRow>
      <DataCol>
        <ChartContainer
          chartClass={Heatmap}
          data={heatmapData}
          name="inprogress_heatmap"
          cachebust={heatmapData}
        />
      </DataCol>
    </DataRow>
  </BlockContent>
);

export default InProgress;
