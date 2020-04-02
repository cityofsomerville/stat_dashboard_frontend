import * as d3 from 'd3';

import Chart from 'charts/Chart';

export default class StackedBarChart extends Chart {
  constructor(args) {
    super({
      ...args,
      chartType: 'Stacked Bar Chart',
      legend: true,
      margin: { top: 0, right: 20, bottom: 20, left: 30 }
    });
    this.columns = args.data.columns;
    this.data = args.data.data;
    this.types = args.data.types;

    this.init();
  }

  init() {
    const self = this;

    self.main = self.chart
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${self.margin.left}, ${self.margin.top})`);

    if (self.data.length) {
      self.initData();
      self.resize();
    }
  }

  initData() {
    const self = this;
    const keys = Object.keys(self.data[0]).filter(key => key !== 'date');

    const stack = d3
      .stack()
      .keys(keys)
      .order(d3.stackOrderDescending); // so that the largest grouping is stacked below the others

    self.series = stack(self.data);

    self.sortedStackedSeries = self.columns.map((day, index) => {
      return {
        data: self.series.map(type => ({
          data: type[index],
          key: type.key
        })),
        date: day
      };
    });

    self.dataContainer = self.chart
      .append('g')
      .attr('transform', d => `translate(${self.margin.left + 1},0)`)
      .selectAll('g')
      .data(self.sortedStackedSeries)
      .join('g')
      .attr('aria-label', d => self.formatDate(d.date))
      .on('mouseover', d => {
        self.tooltip.html(self.getTooltip(d)).style('opacity', 1);
      })
      .on('mousemove', d =>
        self.tooltip
          .style('top', d3.event.pageY - 10 + 'px')
          .style('left', d3.event.pageX + 10 + 'px')
      )
      .on('mouseout', d => self.tooltip.style('opacity', 0));

    self.bars = self.dataContainer
      .selectAll('rect')
      .data(d => d.data)
      .join('rect')
      .attr('role', 'presentation')
      .attr('aria-label', d =>
        self.getLabel({
          [d.key]: d.data.data[d.key]
        })
      )
      .attr('fill', d => self.color(d.key))
      .attr('x', 0);
  }

  color(key) {
    let color = 'black';
    if (this.types[key]) {
      color = this.types[key].color.background;
    }
    return color;
  }

  formatDate(date) {
    return d3.timeFormat('%b %d')(d3.isoParse(date));
  }

  getTooltip(d) {
    return d.data
      .reduce(
        (memo, type) => {
          let rows = memo;
          const count = type.data.data[type.key];
          if (count) {
            rows = [...memo, `<b>${type.key}:</b> ${count}`];
          }
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

    // set up the y scale
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(self.series, series => d3.min(series, d => d[0])),
        d3.max(self.series, series => d3.max(series, d => d[1]))
      ])
      .range([self.height - self.margin.bottom - self.margin.top, 0]);

    const x = d3
      .scaleBand()
      .domain(self.columns)
      .range([0, self.width])
      .paddingInner(0.1);

    // bottom axis generator
    const xAxis = d3
      .axisBottom(x)
      .ticks(7)
      .tickFormat(d => self.formatDate(d));

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

    self.dataContainer.attr('transform', d => `translate(${x(d.date)},0)`);

    self.bars
      .attr('y', d => yScale(d.data[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => Math.abs(yScale(d.data[1]) - yScale(d.data[0])));
  }
}
