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
  constructor({ targetId, ratio, margin, data }) {
    this.targetId = targetId;
    this.targetElement = document.getElementById(targetId);

    this.data = data;
    this.containerWidth = 800;
    this.width = 800;
    this.height = 500;
    this.ratio = ratio || 2 / 3;
    this.margin = margin || { top: 0, right: 20, bottom: 20, left: 20 };

    this.cleanChart();
    window.addEventListener('resize', this.onResize.bind(this));

    this.chart = d3
      .select(`#${targetId}`)
      .append('svg:svg')
      .attr('class', 'chart');

    this.main = this.chart
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
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

  renderChart() {}
}
