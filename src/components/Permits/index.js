import React from 'react';
import { connect } from 'react-redux';

import DataBlock from 'components/DataBlock';
import ExploreData from 'components/ExploreData';
import {
  fetchPermitsExploreData,
  updatePermitsSelectionKey
} from 'data/permits/actions';
import {
  getMapData,
  getChartData,
  getCategoryNames,
  getAllWeeklyTrends
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
  selectionKey,
  mapData,
  fetchPermitsExploreData,
  updatePermitsSelectionKey
}) => (
  <DataBlock
    keyMetrics={[
      { count: 3, label: 'commercial permits', trend: 'positive' },
      { count: 5, label: 'residential permits', trend: 'negative' }
    ]}
  >
    <h2>Building Permits</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <ExploreData
      namespace="permits_licenses"
      selectedDatePreset="7 days"
      selectedCategoryPreset="All Permit Types"
      selectedCategoryNames={selectedCategoryNames}
      categoryPresets={categoryPresets}
      dataStore={dataStore}
      chartData={chartData}
      selectionKey={selectionKey}
      mapData={mapData}
      updateSelectionKey={updatePermitsSelectionKey}
      fetchData={fetchPermitsExploreData}
    />
  </DataBlock>
);

export default connect(
  state => ({
    selectedCategoryNames: ['a', 'b', 'c'],

    dataStore: state.permits.exploreDataCache,
    chartData: {
      data: [],
      columns: []
    },
    selectionKey: null,
    mapData: getMapData(state)
  }),
  {
    fetchPermitsExploreData,
    updatePermitsSelectionKey
  }
)(Permits);
