import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getWorkOrderChartData } from 'data/cityWork/selectors';

export default class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
  }

  componentDidMount() {
    this.chart = new this.props.chartClass({
      data: this.props.data,
      columns: this.props.columns,
      targetId: `chart-container-${this.props.name}`
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.cachebust !== prevProps.cachebust) {
      // this.chart.update({
      //   data: this.props.data,
      //   columns: this.props.columns
      // });
      this.chart = new this.props.chartClass({
        data: this.props.data,
        columns: this.props.columns,
        targetId: `chart-container-${this.props.name}`
      });
    }
  }

  render() {
    return <div id={`chart-container-${this.props.name}`} />;
  }
}

ChartContainer.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  name: PropTypes.string.isRequired,
  chartClass: PropTypes.func.isRequired,
  cachebust: PropTypes.string
};

ChartContainer.defaultProps = {
  data: null,
  columns: []
};
