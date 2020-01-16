import React from 'react';
import { connect } from 'react-redux';

import DataBlock, {
  SectionHeading,
  SectionDescription
} from 'components/DataBlock';
import ExploreData from 'components/ExploreData';
import PermitsKeyMetrics from 'components/Permits/PermitsKeyMetrics';
import { fetchPermitsExploreData } from 'data/permits/actions';
import {
  getMapData,
  getChartData,
  getCategoryNames
} from 'data/permits/selectors';

const categoryPresets = {
  'All Permit Types': [
    'Commercial Building',
    'Residential Building',
    'Sale of Property',
    'Service Renewal',
    'Tree Removal'
  ],
  Commercial: ['Commercial Building'],
  Residential: ['Residential Building']
};

const Permits = ({
  selectedDatePreset,
  selectedCategoryPreset,
  selectedCategoryNames,
  dataStore,
  chartData,
  params,
  mapData,
  fetchPermitsExploreData,
  updatePermitsParams
}) => (
  <DataBlock>
    <h2>Building Permits</h2>
    <SectionHeading>
      <PermitsKeyMetrics />
      <SectionDescription>
        <p>
          This section explores data on building permits of various types that
          have been recently issued.
        </p>
      </SectionDescription>
    </SectionHeading>
    <ExploreData
      namespace="permits_licenses"
      selectedDatePreset="7 days"
      selectedCategoryPreset="All Permit Types"
      selectedCategoryNames={selectedCategoryNames}
      categoryPresets={categoryPresets}
      chartData={chartData}
      params={params}
      mapData={mapData}
      fetchData={fetchPermitsExploreData}
    />
  </DataBlock>
);

export default connect(
  state => ({
    selectedCategoryNames: getCategoryNames(state),
    chartData: getChartData(state),
    params: state.permits.exploreDataParams,
    mapData: getMapData(state)
  }),
  {
    fetchPermitsExploreData
  }
)(Permits);
