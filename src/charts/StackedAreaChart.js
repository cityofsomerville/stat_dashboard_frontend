import * as d3 from 'd3';

import Chart from 'charts/Chart';
import { CHART_COLORS } from 'charts/Constants';

export default class StackedAreaChart extends Chart {
  constructor(args) {
    super({
      ...args,
      legend: true,
      margin: { top: 0, right: 20, bottom: 20, left: 30 }
    });
    this.columns = args.columns;
    this.groupKey = 'date';

    this.color = d3.scaleOrdinal().range(CHART_COLORS);
    this.init();
  }

  init() {
    const self = this;

    self.main = self.chart
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${self.margin.left}, ${self.margin.top})`);

    self.xAxis = self.chart.append('g');

    self.yAxis = self.chart.append('g');

    if (self.data.length) {
      self.resize();
    }
  }

  renderChart() {
    const self = this;

    self.chart
      .attr('width', self.width + self.margin.right + self.margin.left)
      .attr('height', self.height + self.margin.top + self.margin.bottom);

    const keys = Object.keys(self.data[0]).filter(key => key !== 'date');

    const stack = d3
      .stack()
      .keys(keys)
      .order(d3.stackOrderDescending); // so that the largest grouping is stacked below the others

    const series = stack(self.data);

    // set up the x scale
    const xScale = d3
      .scaleTime()
      .domain([
        new Date(self.columns[0]),
        new Date(self.columns[self.columns.length - 1])
      ])
      .range([0, self.width]);

    // set up the y scale
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(series, series => d3.min(series, d => d[0])),
        d3.max(series, series => d3.max(series, d => d[1]))
      ])
      .range([self.height - self.margin.bottom - self.margin.top, 0]);

    // color scale
    const cScale = d3.scaleOrdinal().range(CHART_COLORS);

    // bottom axis generator
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(7)
      .tickFormat(d3.timeFormat('%Y-%m-%d'));

    // left axis generator
    const yAxis = d3.axisLeft().scale(yScale);

    // winging it from here down:
    self.xAxis
      .attr(
        'transform',
        `translate(${self.margin.left}, ${self.height - self.margin.bottom})`
      )
      .call(xAxis);

    self.yAxis
      .attr('transform', `translate(${self.margin.left},${self.margin.top})`)
      .call(yAxis);

    const area = d3
      .area()
      .x(d => xScale(d.data.date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));

    self.main
      .selectAll('.area')
      .data(series)
      .enter()
      .append('path')
      .attr('class', 'area')
      .attr('fill', d => cScale(d.key))
      .attr('d', d => area(d));
  }
}
