import React from 'react';
import { connect } from 'react-redux';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import Heatmap from 'charts/Heatmap';
import { getInProgressHeatmapData } from 'data/cityWork/selectors';

const InProgress = ({ heatmapData }) => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
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
