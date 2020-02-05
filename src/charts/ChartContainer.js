import React from 'react';
import PropTypes from 'prop-types';

export default class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
  }

  componentDidMount() {
    if (this.props.data && this.props.data.length) {
      this.chart = new this.props.chartClass({
        data: this.props.data,
        targetId: `chart-container-${this.props.name}`
      });
    }
  }

  componentWillUnmount() {
    this.chart.cleanChart();
  }

  componentDidUpdate(prevProps) {
    if (this.props.cachebust !== prevProps.cachebust) {
      this.chart = new this.props.chartClass({
        data: this.props.data,
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
