import React from 'react';
import { connect } from 'react-redux';

import DataBlock, {
  SectionHeading,
  SectionDescription
} from 'components/DataBlock';
import ExploreData from 'components/ExploreData';
import PublicSafetyKeyMetrics from 'components/PublicSafety/PublicSafetyKeyMetrics';
import { fetchPublicSafetyExploreData } from 'data/publicSafety/actions';
import {
  getCategoryNames,
  getChartData,
  getMapData,
  getLegendData
} from 'data/publicSafety/selectors';

const categoryPresets = {
  'Quality of Life': [1, 2, 3],
  'Criminal Incidents': [1, 2, 3],
  'Motor Vehicle Citations': [1, 2, 3],
  'Traffic Enforcement': [1, 2, 3]
};

const PublicSafety = ({
  selectedDatePreset,
  selectedCategoryPreset,
  selectedCategoryNames,
  dataStore,
  chartData,
  params,
  mapData,
  fetchData,
  updatePermitsParams,
  legendData
}) => (
  <DataBlock>
    <h2>Public Safety</h2>
    <SectionHeading>
      <PublicSafetyKeyMetrics />
      <SectionDescription>
        <p>Public Safety incident data is explored below.</p>
      </SectionDescription>
    </SectionHeading>
    <ExploreData
      section="Public Safety"
      namespace="public_safety"
      selectedDatePreset="7 days"
      selectedCategoryPreset="Quality of Life"
      selectedCategoryNames={selectedCategoryNames}
      categoryPresets={categoryPresets}
      chartData={chartData}
      params={params}
      mapData={mapData}
      fetchData={fetchData}
      legendData={legendData}
    />
  </DataBlock>
);

export default connect(
  state => ({
    selectedCategoryNames: getCategoryNames(state),
    chartData: getChartData(state),
    params: state.publicSafety.exploreDataParams,
    mapData: getMapData(state),
    legendData: getLegendData(state)
  }),
  {
    fetchData: fetchPublicSafetyExploreData
  }
)(PublicSafety);
