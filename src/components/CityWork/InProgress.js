import React from 'react';
import { connect } from 'react-redux';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import Heatmap from 'charts/Heatmap';
import { getInProgressHeatmapData } from 'data/cityWork/selectors';

const InProgress = ({ heatmapData }) => (
  <BlockContent>
    <p>
      The heatmap below shows the number of new tickets opened per department
      per day within the past 7 days.
    </p>
    <DataRow>
      <DataCol>
        <Heatmap data={heatmapData} />
      </DataCol>
    </DataRow>
  </BlockContent>
);

export default connect(state => ({
  heatmapData: getInProgressHeatmapData(state)
}))(InProgress);
