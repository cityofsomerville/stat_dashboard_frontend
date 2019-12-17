import * as d3 from 'd3';
import parseISO from 'date-fns/parseISO';

import { CHART_COLORS } from 'data/Constants';

const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export default class StackedAreaChart {
  constructor({ data, columns, targetId }) {
    this.data = data;
    this.columns = columns;
    this.groupKey = 'date';

    this.targetId = targetId;
    this.targetElement = document.getElementById(targetId);

    this.containerWidth = 800;
    this.width = 800;
    this.height = 500;
    this.ratio = 2 / 3;
    this.margin = { top: 0, right: 20, bottom: 20, left: 20 };

    // todo: pick high-contrast, universal palette
    this.color = d3
      .scaleOrdinal()
      .range([
        '#98abc5',
        '#8a89a6',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00'
      ]);

    this.init();
  }

  resize() {
    const containerWidth = this.targetElement.offsetWidth;

    if (containerWidth !== this.containerWidth) {
      this.width = containerWidth - this.margin.left - this.margin.right;
      this.height =
        containerWidth * this.ratio - this.margin.top - this.margin.bottom;
      this.renderChart();
    }
  }

  onResize() {
    const fn = event => {
      this.resize();
    };
    debounce(fn.bind(this), 1000)();
  }

  cleanChart() {
    window.removeEventListener('resize', this.onResize.bind(this));
    this.targetElement.innerHTML = '';
    // const tooltip = document.getElementById('tooltip');
    // if (tooltip) {
    //   tooltip.parentNode.removeChild(tooltip);
    // }
  }

  init() {
    const self = this;
    window.addEventListener('resize', this.onResize.bind(this));

    self.cleanChart();
    self.chart = d3
      .select(`#${self.targetId}`)
      .append('svg:svg')
      .attr('class', 'chart');

    self.main = self.chart
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${self.margin.left}, ${self.margin.top})`);

    self.xAxis = self.chart.append('g');

    self.yAxis = self.chart.append('g');

    self.resize();
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
      .range([0, self.width - self.margin.left - self.margin.right]);

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
