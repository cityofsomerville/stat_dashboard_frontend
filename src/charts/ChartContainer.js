import React from 'react';
import PropTypes from 'prop-types';

export default class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
  }

  componentDidMount() {
    if (this.props.data) {
      this.initChart();
    }
  }

  initChart() {
    if (this.chart) {
      this.chart.cleanChart();
    }
    this.chart = new this.props.chartClass({
      data: this.props.data,
      title: this.props.title,
      description: this.props.description,
      targetId: `chart-container-${this.props.name}`
    });
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.cleanChart();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.cachebust !== prevProps.cachebust) {
      this.initChart();
    }
  }

  render() {
    return (
      <div
        className="bg-light border p-2"
        id={`chart-container-${this.props.name}`}
      />
    );
  }
}

ChartContainer.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.shape()]),
  columns: PropTypes.array,
  name: PropTypes.string.isRequired,
  chartClass: PropTypes.func.isRequired,
  cachebust: PropTypes.string
};

ChartContainer.defaultProps = {
  data: null,
  columns: []
};
