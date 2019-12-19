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

    this.color = d3.scaleOrdinal().range(CHART_COLORS);

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
  }

  init() {
    const self = this;
    window.addEventListener('resize', this.onResize.bind(this));

    self.cleanChart();

    self.chart = d3
      .select(`#${self.targetId}`)
      .append('svg:svg')
      .attr('class', 'chart');

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
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    leaf.append('title').text(
      d =>
        `${d
          .ancestors()
          .reverse()
          .map(d => d.data.name)
          .join('/')}\n${d.value}`
    );

    leaf
      .append('rect')
      // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr('fill', d => {
        while (d.depth > 1) d = d.parent;
        return self.color(d.data.name);
      })
      .attr('fill-opacity', 0.6)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0);

    leaf
      .append('clipPath')
      // .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
      .append('use');
    // .attr("xlink:href", d => d.leafUid.href);

    leaf
      .append('text')
      // .attr("clip-path", d => d.clipUid)
      .selectAll('tspan')
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(d.value))
      .join('tspan')
      .attr('x', 3)
      .attr(
        'y',
        (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
      )
      .attr('fill-opacity', (d, i, nodes) =>
        i === nodes.length - 1 ? 0.7 : null
      )
      .text(d => d);
  }
}
