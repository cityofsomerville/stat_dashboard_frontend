import * as d3 from 'd3';

import Chart from 'charts/Chart';
import { CHART_COLORS } from 'charts/Constants';

export default class GroupedBarChart extends Chart {
  constructor(args) {
    super({
      ...args,
      chartType: 'Grouped Bar Chart',
      legend: true,
      margin: { top: 10, right: 10, bottom: 20, left: 35 }
    });
    this.columns = this.data.columns;
    this.data = this.data.data;
    this.keys = this.columns.slice(1);
    this.groupKey = this.columns[0];

    this.color = d3.scaleOrdinal().range(CHART_COLORS.map(c => c.background));

    this.init();
  }

  init() {
    const self = this;
    window.addEventListener('resize', this.onResize.bind(this));

    self.xAxis = self.chart.append('g').attr('aria-hidden', true);

    self.yAxis = self.chart.append('g').attr('aria-hidden', true);

    self.dataContainer = self.chart
      .append('g')
      .selectAll('g')
      .data(self.data)
      .join('g')
      .attr('aria-label', d => d.Date)
      .on('mouseover', d => {
        self.tooltip
          .html(
            `Date: ${d.Date}<br/>
                Tickets Opened: ${d['Tickets Opened']}<br/>
                Tickets Closed: ${d['Tickets Closed']}`
          )
          .style('opacity', 1);
      })
      .on('mousemove', d =>
        self.tooltip
          .style('top', d3.event.pageY - 10 + 'px')
          .style('left', d3.event.pageX + 10 + 'px')
      )
      .on('mouseout', d => self.tooltip.style('opacity', 0));

    self.bars = self.dataContainer
      .selectAll('rect')
      .data(d => self.keys.map(key => ({ key, value: d[key] })))
      .join('rect')
      .attr('fill', d => self.color(d.key));

    self.legend = self.chart
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);

    self.rows = self.legend
      .selectAll('g')
      .data(
        self.color
          .domain()
          .slice()
          .reverse()
      )
      .join('g')
      .attr('transform', (d, i) => `translate(${i * 100}, 0)`);

    self.rows
      .append('rect')
      .attr('x', 0)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', self.color);

    self.rows
      .append('text')
      .attr('x', 24)
      .attr('y', 9.5)
      .attr('dy', '0.35em')
      .text(d => d);

    self.resize();
  }

  renderChart() {
    const self = this;

    self.chart
      .attr('width', self.width + self.margin.right + self.margin.left)
      .attr('height', self.height + self.margin.top + self.margin.bottom);

    const x0 = d3
      .scaleBand()
      .domain(self.data.map(d => d[self.groupKey]))
      .rangeRound([self.margin.left, self.width - self.margin.right])
      .paddingInner(0.1);

    const x1 = d3
      .scaleBand()
      .domain(self.keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(self.data, d => d3.max(self.keys, key => d[key]))])
      .nice()
      .rangeRound([self.height - self.margin.bottom, self.margin.top]);

    self.xAxis
      .attr('transform', `translate(0,${self.height - self.margin.bottom})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0));

    self.yAxis
      .attr('transform', `translate(${self.margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'));

    self.dataContainer.attr(
      'transform',
      d => `translate(${x0(d[self.groupKey])},0)`
    );

    self.bars
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => Math.abs(y(0) - y(d.value)));

    self.legend.attr(
      'transform',
      `translate(${self.margin.left}, ${self.height + self.margin.top})`
    );
  }
}
