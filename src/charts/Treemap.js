import * as d3 from 'd3';

import { CHART_COLORS } from 'charts/Constants';
import Chart from './Chart';

export default class Treemap extends Chart {
  constructor(args) {
    super({
      ...args,
      chartType: 'Treemap',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      ratio: 2 / 3,
      data: {
        name: 'Treemap',
        children: args.data
      }
    });

    this.groupKey = 'date';

    this.color = d3.scaleOrdinal().range(CHART_COLORS.map(c => c.background));
    this.textColor = d3.scaleOrdinal().range(CHART_COLORS.map(c => c.color));

    this.resize();
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

    const leaf = self.main
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
      .attr('role', 'presentation')
      .attr('aria-label', d => `${d.data.name}: ${d.data.value} tickets`)
      .attr('fill', d => {
        while (d.depth > 1) d = d.parent;
        return self.color(d.data.name);
      })
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0);

    leaf
      .append('text')
      .attr('aria-hidden', true)
      .attr('fill', d => self.textColor(d.data.name))
      .attr('font-size', 10)
      .attr('x', 3)
      .attr('y', 12)
      .text(d => `${d.data.name}`);

    leaf
      .append('text')
      .attr('aria-hidden', true)
      .attr('fill', d => self.textColor(d.data.name))
      .attr('font-size', 10)
      .attr('x', 3)
      .attr('y', 22)
      .text(d => `${d.data.value}`);
  }
}
