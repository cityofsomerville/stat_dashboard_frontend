import * as d3 from 'd3';

import Chart from 'charts/Chart';

export default class Heatmap extends Chart {
  constructor(args) {
    super(args);
    this.init();
  }

  init() {
    const self = this;
    self.renderChart();
  }

  renderChart() {
    console.log('render');
  }
}
