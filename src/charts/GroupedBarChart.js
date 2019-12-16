import * as d3 from 'd3';

const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export default class GroupedBarChart {
  constructor({ data, columns, targetId }) {
    this.data = data;
    this.keys = columns.slice(1);
    this.groupKey = columns[0];

    this.targetId = targetId;
    this.targetElement = document.getElementById(targetId);

    this.containerWidth = 800;
    this.width = 800;
    this.height = 500;
    this.ratio = 2 / 3;
    this.margin = { top: 10, right: 10, bottom: 20, left: 40 };

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

    self.xAxis = self.chart.append('g');

    self.yAxis = self.chart.append('g');

    self.dataContainer = self.chart
      .append('g')
      .selectAll('g')
      .data(self.data)
      .join('g');

    self.bars = self.dataContainer
      .selectAll('rect')
      .data(d => self.keys.map(key => ({ key, value: d[key] })))
      .join('rect')
      .attr('fill', d => self.color(d.key));

    self.legend = self.chart
      .append('g')
      .attr('text-anchor', 'end')
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
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    self.rows
      .append('rect')
      .attr('x', -19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', self.color);

    self.rows
      .append('text')
      .attr('x', -24)
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
      .call(d3.axisBottom(x0).tickSizeOuter(0))
      .call(g => g.select('.domain').remove());

    self.yAxis
      .attr('transform', `translate(${self.margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'))
      .call(g => g.select('.domain').remove());

    self.dataContainer.attr(
      'transform',
      d => `translate(${x0(d[self.groupKey])},0)`
    );

    self.bars
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => y(0) - y(d.value));

    self.legend.attr('transform', `translate(${self.width},0)`);
  }
}
