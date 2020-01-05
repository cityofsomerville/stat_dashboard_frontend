import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

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

  fetchIfNecessary() {
    const requestKey = this.getRequestKey();
    if (requestKey && !this.props.dataStore[requestKey]) {
      this.props.fetchData(requestKey);
    } else if (requestKey && this.props.selectionKey !== requestKey) {
      this.props.updateSelectionKey(requestKey);
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
          Currently viewing tickets closed within the past{' '}
          {this.state.selectedDatePreset} for preset{' '}
          {this.state.selectedCategoryPreset}, which contains categories{' '}
          {this.props.selectedCategoryNames}. The stacked area chart shows the
          volume of tickets of each type, while the map shows the approximate
          location of each ticket.
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

  categoryPresets: PropTypes.array.isRequired,
  chartData: PropTypes.shape({
    data: PropTypes.array,
    columns: PropTypes.array
  }).isRequired,
  namespace: PropTypes.string.isRequired,
  selectionKey: PropTypes.string,
  mapData: PropTypes.array.isRequired,
  dataStore: PropTypes.shape().isRequired,

  fetchData: PropTypes.func.isRequired,
  updateSelectionKey: PropTypes.func.isRequired
};

export default ExploreData;
