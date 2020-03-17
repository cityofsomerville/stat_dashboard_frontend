import * as d3 from 'd3';

import Chart from 'charts/Chart';
import { CHART_COLORS } from 'charts/Constants';

export default class StackedAreaChart extends Chart {
  constructor(args) {
    super({
      ...args,
      legend: true,
      margin: { top: 0, right: 20, bottom: 20, left: 40 },
      ratio: 1 / 3
    });
    this.columns = args.data.columns;
    this.data = args.data.data;
    this.types = args.data.types;
    this.groupKey = 'date';

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

    self.dataContainer = self.chart.append('g');

    if (self.data.length) {
      self.resize();
    }
  }

  color(key) {
    let color = 'black';
    if (this.types[key]) {
      color = this.types[key].color.background;
    }
    return color;
  }

  formatDate(date) {
    return d3.timeFormat('%b %d, %Y')(d3.isoParse(date));
  }

  getTooltip(d) {
    return Object.keys(d)
      .filter(key => key !== 'date' && key !== 'dateStamp')
      .sort((a, b) => d[b] - d[a])
      .reduce(
        (memo, key) => {
          let rows = memo;
          rows = [...memo, `<b>${key}:</b> ${d[key]}`];
          return rows;
        },
        [`<b>Date</b>: ${this.formatDate(d.date)}`]
      )
      .join('<br/>');
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
      .range([0, self.width - self.margin.left]);

    // set up the y scale
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(series, series => d3.min(series, d => d[0])),
        d3.max(series, series => d3.max(series, d => d[1]))
      ])
      .range([self.height - self.margin.bottom - self.margin.top, 0]);

    // bottom axis generator
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y'));

    // left axis generator
    const yAxis = d3.axisLeft().scale(yScale);

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

    // self.dataContainer = self.chart.append('g');
    self.dataContainer
      .attr('transform', d => `translate(${self.margin.left + 1},0)`)
      .selectAll('rect')
      .data(self.data)
      .join('rect')
      .attr('id', d => `bar-${d.date}`)
      .attr('height', self.height - self.margin.bottom)
      .attr('width', (self.width - self.margin.left) / self.data.length)
      .attr('fill', '#555')
      .attr('x', d => xScale(d.date))
      .attr('opacity', 0)
      .on('mouseover', d => {
        self.tooltip.html(self.getTooltip(d)).style('opacity', 1);
      })
      .on('mousemove', d =>
        self.tooltip
          .style('top', d3.event.pageY - 10 + 'px')
          .style('left', d3.event.pageX + 10 + 'px')
      )
      .on('mouseout', d => {
        self.tooltip.style('opacity', 0);
      });

    self.main
      .selectAll('.area')
      .data(series)
      .enter()
      .append('path')
      .attr('class', 'area')
      .attr('fill', d => self.color(d.key))
      .attr('d', d => area(d));
  }
}
