import * as d3 from 'd3';

import { CHART_COLORS } from 'charts/Constants';

const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export default class Treemap {
  constructor({ data, targetId }) {
    this.data = {
      name: 'Treemap',
      children: data
    };
    this.groupKey = 'date';

    this.targetId = targetId;
    this.targetElement = document.getElementById(targetId);

    this.containerWidth = 800;
    this.width = 800;
    this.height = 500;
    this.ratio = 2 / 3;
    this.margin = { top: 0, right: 0, bottom: 0, left: 0 };

    this.color = d3.scaleOrdinal().range(CHART_COLORS.map(c => c.background));
    this.textColor = d3.scaleOrdinal().range(CHART_COLORS.map(c => c.color));

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

    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }

  init() {
    const self = this;
    window.addEventListener('resize', this.onResize.bind(this));

    self.cleanChart();

    self.chart = d3
      .select(`#${self.targetId}`)
      .append('svg:svg')
      .attr('class', 'chart');

    self.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip rounded border p-1 bg-light')
      .attr('id', 'tooltip');

    self.resize();
  }

  renderChart() {
    const self = this;

    self.chart
      .attr('width', self.width + self.margin.right + self.margin.left)
      .attr('height', self.height + self.margin.top + self.margin.bottom);

    const treemap = data =>
      d3
        .treemap()
        .tile(d3.treemapSquarify)
        .size([self.width, self.height])
        .padding(1)
        .round(true)(
        d3
          .hierarchy(self.data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value)
      );

    const root = treemap(self.data);

    const leaf = self.chart
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .style('cursor', 'default')
      .on('mouseover', d =>
        self.tooltip
          .html(`Dept: ${d.data.name}<br/>Tickets: ${d.data.value}`)
          .style('opacity', 1)
      )
      .on('mousemove', d =>
        self.tooltip
          .style('top', d3.event.pageY - 10 + 'px')
          .style('left', d3.event.pageX + 10 + 'px')
      )
      .on('mouseout', d => self.tooltip.style('opacity', 0));

    leaf
      .append('rect')
      .attr('fill', d => {
        while (d.depth > 1) d = d.parent;
        return self.color(d.data.name);
      })
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0);

    leaf
      .append('text')
      .attr('fill', d => self.textColor(d.data.name))
      .attr('font-size', 10)
      .attr('x', 3)
      .attr('y', 12)
      .text(d => `${d.data.name}`);

    leaf
      .append('text')
      .attr('fill', d => self.textColor(d.data.name))
      .attr('font-size', 10)
      .attr('x', 3)
      .attr('y', 22)
      .text(d => `${d.data.value}`);
  }
}
