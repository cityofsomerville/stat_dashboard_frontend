import React from 'react';
import { connect } from 'react-redux';

import GroupedBarChart from 'charts/GroupedBarChart';
import { getWorkOrderChartData } from 'data/cityWork/selectors';

class WorkOrderChart extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.chartData && this.props.chartData.data.length) {
      this.chart = new GroupedBarChart({
        data: this.props.chartData.data,
        columns: this.props.chartData.columns,
        targetId: 'chart-container'
      });
    }
  }

  render() {
    return <div id="chart-container" />;
  }
}

export default connect(state => ({
  chartData: getWorkOrderChartData(state)
}))(WorkOrderChart);
