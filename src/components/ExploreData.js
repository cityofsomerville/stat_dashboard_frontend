import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import listify from 'listify';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import { DATE_PRESETS } from 'data/Constants';
import ChartContainer from 'charts/ChartContainer';
import StackedAreaChart from 'charts/StackedAreaChart';

const LazyMap = ({ markers }) => {
  if (typeof window === 'undefined') return <span>loading...</span>;
  const Component = lazy(() => import('components/Map'));
  return (
    <Suspense fallback={<span>loading...</span>}>
      <Component markers={markers} />
    </Suspense>
  );
};

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

  getParams() {
    let { selectedCategories, selectedDateRange } = this.state;
    let params = null;

    if (this.state.selectedCategoryPreset !== 'Custom...') {
      selectedCategories = this.props.categoryPresets[
        this.state.selectedCategoryPreset
      ];
    }

    if (this.state.selectedDatePreset !== 'Custom...') {
      selectedDateRange = DATE_PRESETS[this.state.selectedDatePreset];
    }

    if (selectedCategories && selectedCategories.length && selectedDateRange) {
      params = JSON.stringify({
        categories: selectedCategories.sort(),
        dateRange: selectedDateRange,
        preset: this.state.selectedCategoryPreset
      });
    }
    return params;
  }

  fetchIfNecessary() {
    const params = this.getParams();
    if (params && this.props.params !== params) {
      this.props.fetchData(params);
    }
  }

  componentDidUpdate(prevProps) {
    this.fetchIfNecessary();
  }

  componentDidMount() {
    this.fetchIfNecessary();
  }

  render() {
    return (
      <BlockContent>
        <p>
          Currently viewing tickets opened within the past{' '}
          {this.state.selectedDatePreset} for preset{' '}
          {this.state.selectedCategoryPreset}, which contains categories{' '}
          {listify(this.props.selectedCategoryNames)}. The stacked area chart
          shows the volume of tickets of each type, while the map shows the
          approximate location of each ticket.
        </p>
        <form>
          <label htmlFor={`${this.props.namespace}_category`}>Category</label>
          {/* TODO: aria-describedby explanation of this field */}
          <select
            id={`${this.props.namespace}_category`}
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
          <label htmlFor={`${this.props.namespace}_date_range`}>
            Date Range
          </label>
          <select
            id={`${this.props.namespace}_date_range`}
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
              cachebust={this.props.params}
            />
          </DataCol>
          <DataCol>
            <LazyMap markers={this.props.mapData} />
          </DataCol>
        </DataRow>
      </BlockContent>
    );
  }
}

ExploreData.propTypes = {
  selectedDatePreset: PropTypes.string,
  selectedCategoryPreset: PropTypes.string,
  selectedCategoryNames: PropTypes.array,

  categoryPresets: PropTypes.shape().isRequired,
  chartData: PropTypes.shape({
    data: PropTypes.array,
    columns: PropTypes.array
  }).isRequired,
  namespace: PropTypes.string.isRequired,
  params: PropTypes.string,
  mapData: PropTypes.array.isRequired,

  fetchData: PropTypes.func.isRequired
};

export default ExploreData;
