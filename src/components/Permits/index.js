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
  getCategoryNames,
  getLegendData
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
  Residential: ['Residential Building'],
  'Sale of Property': ['Sale of Property'],
  'Service Renewal': ['Service Renewal'],
  'Tree Removal': ['Tree Removal']
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
  updatePermitsParams,
  legendData
}) => (
  <DataBlock>
    <h2>Building Permits</h2>
    <SectionHeading>
      <PermitsKeyMetrics />
      <SectionDescription>
        <p>
          This section explores data on building permits and licenses that have
          been recently issued. You can click on the dot to see what type of
          permit was issued as well as the fee and the submitted description of
          the work being done. Access{' '}
          <a
            href="https://data.somervillema.gov/dataset/Somerville_Permits/vxgw-vmky"
            target="_blank"
            rel="noopener noreferrer"
          >
            the full permits dataset here
          </a>
          .
        </p>
      </SectionDescription>
    </SectionHeading>
    <ExploreData
      section="Permits and Licenses"
      namespace="permits_licenses"
      selectedDatePreset="7 days"
      selectedCategoryPreset="All Permit Types"
      selectedCategoryNames={selectedCategoryNames}
      categoryPresets={categoryPresets}
      chartData={chartData}
      params={params}
      mapData={mapData}
      fetchData={fetchPermitsExploreData}
      legendData={legendData}
    />
  </DataBlock>
);

export default connect(
  state => ({
    selectedCategoryNames: getCategoryNames(state),
    chartData: getChartData(state),
    params: state.permits.exploreDataParams,
    mapData: getMapData(state),
    legendData: getLegendData(state)
  }),
  {
    fetchPermitsExploreData
  }
)(Permits);
