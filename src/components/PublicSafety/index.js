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
  getMapData
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
  updatePermitsParams
}) => (
  <DataBlock>
    <h2>Public Safety</h2>
    <SectionHeading>
      <PublicSafetyKeyMetrics />
      <SectionDescription>
        <p>
          This section explores data on building permits of various types that
          have been recently issued.
        </p>
      </SectionDescription>
    </SectionHeading>
    <ExploreData
      namespace="public_safety"
      selectedDatePreset="7 days (last available data)"
      selectedCategoryPreset="Quality of Life"
      selectedCategoryNames={selectedCategoryNames}
      categoryPresets={categoryPresets}
      chartData={chartData}
      params={params}
      mapData={mapData}
      fetchData={fetchData}
    />
  </DataBlock>
);

export default connect(
  state => ({
    selectedCategoryNames: getCategoryNames(state),
    chartData: getChartData(state),
    params: state.publicSafety.exploreDataParams,
    mapData: getMapData(state)
  }),
  {
    fetchData: fetchPublicSafetyExploreData
  }
)(PublicSafety);
