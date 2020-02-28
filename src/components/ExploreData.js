import React, { lazy, Suspense } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import listify from 'listify';
import endOfYesterday from 'date-fns/endOfYesterday';
import parseISO from 'date-fns/parseISO';
import dateFnsLocalizer from 'react-widgets-date-fns';
import 'react-widgets/dist/css/react-widgets.css';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import { DATE_PRESETS } from 'data/Constants';
import { formatTimestamp } from 'data/utils';
import ChartContainer from 'charts/ChartContainer';
import StackedBarChart from 'charts/StackedBarChart';

dateFnsLocalizer();

const LazyMap = ({ markers }) => {
  if (typeof window === 'undefined') return <span>loading...</span>;
  const Component = lazy(() => import('components/Map'));
  return (
    <Suspense fallback={<span>loading...</span>}>
      <Component markers={markers} />
    </Suspense>
  );
};

const CustomDatePicker = ({ name, label, onChange, value, min, max }) => (
  <label
    className="small mr-1"
    style={{ width: '8rem' }}
    htmlFor={`${name}_input`}
  >
    {label}
    <DateTimePicker
      time={false}
      id={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />
  </label>
);

class ExploreData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategoryPreset: props.selectedCategoryPreset,
      selectedCategories: null,
      selectedDatePreset: props.selectedDatePreset,
      selectedDateRange: DATE_PRESETS[props.selectedDatePreset]
    };

    this.endDate = endOfYesterday();

    this.fetchIfNecessary = this.fetchIfNecessary.bind(this);
  }

  getParams() {
    let { selectedCategories, selectedDateRange } = this.state;
    let params = null;

    if (this.state.selectedCategoryPreset !== 'Custom...') {
      selectedCategories = this.props.categoryPresets[
        this.state.selectedCategoryPreset
      ];
    }

    selectedDateRange = this.state.selectedDateRange;

    if (selectedCategories && selectedCategories.length && selectedDateRange) {
      params = JSON.stringify({
        categories: selectedCategories.sort(),
        dateRange: selectedDateRange,
        preset: this.state.selectedCategoryPreset
      });
    }
    return params;
  }

  setCustomDate(value, name) {
    this.setState({
      selectedDateRange: {
        ...this.state.selectedDateRange,
        [name]: formatTimestamp(value)
      }
    });
  }

  fetchIfNecessary() {
    const params = this.getParams();
    if (params && this.props.params !== params) {
      this.props.fetchData(params);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedCategoryPreset !== this.props.selectedCategoryPreset ||
      prevProps.selectedDatePreset !== this.props.selectedDatePreset
    ) {
      this.fetchIfNecessary();
    }
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
        <form className="form-row mb-2">
          <fieldset className="col-auto mb-sm-2 mr-sm-4">
            <label htmlFor={`${this.props.namespace}_category`}>Category</label>
            {/* TODO: aria-describedby explanation of this field */}
            <select
              className="form-control"
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
          </fieldset>
          <fieldset className="col-auto">
            <label htmlFor={`${this.props.namespace}_date_range`}>
              Date Range
            </label>
            <select
              className="form-control"
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
            <div
              className={cn('mt-1', {
                'd-none': this.state.selectedDatePreset !== 'Custom...'
              })}
            >
              <CustomDatePicker
                name={`${this.props.namespace}_startDate`}
                label="Start Date"
                value={parseISO(this.state.selectedDateRange.startDate)}
                max={parseISO(this.state.selectedDateRange.endDate)}
                onChange={value => this.setCustomDate(value, 'startDate')}
              />
              <CustomDatePicker
                name={`${this.props.namespace}_endDate`}
                label="End Date"
                value={parseISO(this.state.selectedDateRange.endDate)}
                min={parseISO(this.state.selectedDateRange.startDate)}
                max={this.endDate}
                onChange={value => this.setCustomDate(value, 'endDate')}
              />
              <button
                className="btn btn-primary small"
                type="button"
                onClick={this.fetchIfNecessary}
              >
                Go
              </button>
            </div>
          </fieldset>
        </form>

        <DataRow>
          <DataCol>
            <ChartContainer
              data={this.props.chartData}
              chartClass={StackedBarChart}
              name={`explore-data-${this.props.namespace}`}
              cachebust={this.props.params}
            />
          </DataCol>
          <DataCol>
            <LazyMap markers={this.props.mapData} />
          </DataCol>
        </DataRow>
        <div
          className="border bg-light mt-2 py-2 px-3"
          style={{ fontSize: '0.7rem' }}
        >
          <span className="d-block h5 mb-2">Legend</span>
          <ul className="list-unstyled mb-0 d-flex flex-wrap align-items-center">
            {this.props.legendData
              ? this.props.legendData.map(category => (
                  <li
                    className="d-flex align-items-center mb-2 pr-1"
                    style={{ width: '10rem' }}
                    key={category.name}
                  >
                    <div
                      className="d-inline-block mr-2"
                      style={{
                        width: '1.8rem',
                        minWidth: '1.8rem',
                        height: '1.8rem',
                        background: category.color.background
                      }}
                    ></div>
                    <span className="flex-shrink-1 text-break">
                      {category.name}
                    </span>
                  </li>
                ))
              : null}
          </ul>
        </div>
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

  fetchData: PropTypes.func.isRequired,
  legendData: PropTypes.shape()
};

export default ExploreData;
