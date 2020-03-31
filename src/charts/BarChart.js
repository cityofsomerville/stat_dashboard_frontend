import * as d3 from 'd3';

import Chart from 'charts/Chart';
import { CHART_COLORS } from 'charts/Constants';
import { BASE_URL } from 'data/Constants';

const getRange = (data, figure) => {
  const series = data.map(d => d[figure]);
  return `The maximum is ${d3.max(series)}. The minimum is ${d3.min(series)}.`;
};

export default class BarChart extends Chart {
  constructor(args) {
    super({
      ...args,
      chartType: 'Bar Chart',
      description: `${args.description} ${getRange(
        args.data.data,
        args.data.figure
      )}`,
      margin: { top: 0, right: 20, bottom: 40, left: 50 },
      ratio: 1 / 3
    });
    this.figure = args.data.figure;
    this.label = args.data.label;
    this.data = args.data.data;

    this.init();
  }

  init() {
    const self = this;

    self.main = self.chart
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${self.margin.left}, ${self.margin.top})`);

    self.xAxis = self.chart.append('g').attr('aria-hidden', true);

    self.yAxis = self.chart.append('g').attr('aria-hidden', true);

    if (self.data.length) {
      self.initData();
      self.resize();
    }
  }

  initData() {
    const self = this;

    self.dataContainer = self.chart
      .append('g')
      .attr('transform', d => `translate(${self.margin.left + 1},0)`);

    self.bars = self.dataContainer
      .selectAll('rect')
      .data(self.data)
      .join('rect')
      .attr('fill', d => self.color(d.key))
      .attr('role', 'presentation')
      .attr('aria-label', d => self.getLabel(self.getData(d)))
      .on('mouseover', d => {
        self.tooltip.html(self.getTooltip(self.getData(d))).style('opacity', 1);
      })
      .on('mousemove', d =>
        self.tooltip
          .style('top', d3.event.pageY - 10 + 'px')
          .style('left', d3.event.pageX + 10 + 'px')
      )
      .on('mouseout', d => self.tooltip.style('opacity', 0));
  }

  color(key) {
    return CHART_COLORS[0].background;
  }

  getData(d) {
    return {
      Page: d[this.label],
      Views: d[this.figure],
      URL: `${BASE_URL}${d.url}`
    };
  }

  renderChart() {
    const self = this;

    self.chart
      .attr('width', self.width + self.margin.right + self.margin.left)
      .attr('height', self.height + self.margin.top + self.margin.bottom);

    // set up the y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(self.data, data => data[self.figure])])
      .range([self.height - self.margin.bottom - self.margin.top, 0]);

    const x = d3
      .scaleBand()
      .domain(self.data.map(d => d[self.label]))
      .range([0, self.width])
      .paddingInner(0.1);

    // bottom axis generator
    const xAxis = d3.axisBottom(x).tickFormat(d => {
      let label = d;
      if (label.length > 20) {
        label = label.slice(0, 20) + '...';
      }
      return label;
    });

    // left axis generator
    const yAxis = d3.axisLeft().scale(y);

    self.xAxis
      .attr(
        'transform',
        `translate(${self.margin.left}, ${self.height - self.margin.bottom})`
      )
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-0.5rem')
      .attr('dy', '0.15rem')
      .attr('transform', 'rotate(-35)');

    self.yAxis
      .attr('transform', `translate(${self.margin.left},${self.margin.top})`)
      .call(yAxis);

    self.bars
      .attr('y', d => y(d[self.figure]))
      .attr('x', d => x(d[self.label]))
      .attr('width', x.bandwidth())
      .attr(
        'height',
        d =>
          self.height - self.margin.bottom - self.margin.top - y(d[self.figure])
      );
  }
}
