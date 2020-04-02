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

export default class Chart {
  constructor({
    targetId,
    ratio,
    margin,
    data,
    title,
    description,
    chartType = 'Chart'
  }) {
    this.targetId = targetId;
    this.targetElement = document.getElementById(targetId);

    this.data = data;
    this.containerWidth = 800;
    this.width = 800;
    this.height = 500;
    this.chartType = chartType;
    this.title = title;
    this.description = description;
    this.ratio = ratio || 2 / 3;
    this.margin = margin || { top: 0, right: 20, bottom: 20, left: 20 };

    this.cleanChart();
    window.addEventListener('resize', this.onResize.bind(this));

    this.chart = d3
      .select(`#${targetId}`)
      .append('svg:svg')
      .attr('role', 'group')
      .attr('tabindex', 0)
      .attr('aria-roledescription', 'chart')
      .attr('aria-label', this.chartType)
      .attr('aria-describedby', `${targetId}-title ${targetId}-desc`)
      .attr('class', 'chart');

    this.chart
      .append('title')
      .attr('id', `${targetId}-title`)
      .text(this.title);

    this.chart
      .append('desc')
      .attr('id', `${targetId}-desc`)
      .text(this.description);

    this.main = this.chart
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxis = this.chart.append('g').attr('aria-hidden', true);

    this.yAxis = this.chart.append('g').attr('aria-hidden', true);

    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip rounded border p-1 bg-light')
      .style('max-width', '18rem')
      .attr('id', `tooltip-${targetId}`);
  }

  getLabel(data) {
    return Object.keys(data)
      .map(key => `${key}: ${data[key]}`)
      .join('. '); // so screen reader will pause
  }

  getTooltip(data) {
    return Object.keys(data)
      .map(key => `<span><strong>${key}:</strong> ${data[key]}</span>`)
      .join('<br/>');
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
    debounce(fn.bind(this), 100)();
  }

  cleanChart() {
    window.removeEventListener('resize', this.onResize.bind(this));
    this.targetElement.innerHTML = '';

    const tooltip = document.getElementById(`tooltip-${this.targetId}`);
    if (tooltip) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }

  renderChart() {}
}
