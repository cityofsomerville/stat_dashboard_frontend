import React, { useState } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import Map from 'components/Map';
import { DATE_PRESETS, SOCRATA_TIMESTAMP } from 'data/Constants';
import ChartContainer from 'charts/ChartContainer';
import StackedAreaChart from 'charts/StackedAreaChart';

class ExploreData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategoryPreset: props.selectedCategoryPreset,
      selectedCategories: null,
      selectedDatePreset: props.selectedDatePreset,
      selectedDateRange: null
    };
  }

  getRequestKey() {
    let { selectedCategories, selectedDateRange } = this.state;
    let key = null;

    if (this.state.selectedCategoryPreset !== 'Custom...') {
      selectedCategories = this.props.categoryPresets[
        this.state.selectedCategoryPreset
      ];
    }

    if (this.state.selectedDatePreset !== 'Custom...') {
      selectedDateRange = DATE_PRESETS[this.state.selectedDatePreset];
    }

    if (selectedCategories && selectedCategories.length && selectedDateRange) {
      key = JSON.stringify({
        categories: selectedCategories.sort(),
        dateRange: selectedDateRange
      });
    }
    return key;
  }

  componentDidUpdate(prevProps) {
    const requestKey = this.getRequestKey();
    if (requestKey && !this.props.dataStore[requestKey]) {
      this.props.fetchData(requestKey);
    }
  }

  render() {
    return (
      <BlockContent>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus.
        </p>
        <form>
          <label htmlFor="category">Category</label>
          {/* TODO: aria-describedby explanation of this field */}
          <select
            id="category"
            value={this.state.selectedCategoryPreset}
            onChange={e =>
              this.setState({ selectedCategoryPreset: e.target.value })
            }
          >
            {Object.keys(this.props.categoryPresets).map(preset => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
          <label htmlFor="date_range">Date Range</label>
          <select
            id="date_range"
            value={this.state.selectedDatePreset}
            onChange={e =>
              this.setState({ selectedDatePreset: e.target.value })
            }
          >
            {Object.keys(DATE_PRESETS).map(preset => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
        </form>

        <DataRow>
          <DataCol>
            <ChartContainer
              data={this.props.chartData.data}
              columns={this.props.chartData.columns}
              chartClass={StackedAreaChart}
              name={`explore-data-${this.props.namespace}`}
              cachebust={this.props.selectionKey}
            />
          </DataCol>
          <DataCol>
            <Map markers={this.props.mapData} />
          </DataCol>
        </DataRow>
      </BlockContent>
    );
  }
}

ExploreData.propTypes = {
  categoryList: PropTypes.object,
  namespace: PropTypes.string,
  mapData: PropTypes.array
};

export default ExploreData;
