import React from 'react';
import PropTypes from 'prop-types';

export const KeyMetrics = ({ metrics }) => (
  <div className="col-md-4 p-3 mb-3 mb-md-0 bg-dark text-white">
    <h3>Yesterday</h3>
    <ul>
      {metrics.map((metric, i) => (
        <li key={i}>
          <strong>{metric.count}</strong> {metric.label}
        </li>
      ))}
    </ul>
  </div>
);

KeyMetrics.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      label: PropTypes.string,
      trend: PropTypes.string
    })
  ).isRequired
};

export const WeeklyTrends = ({ metrics }) => (
  <div className="col-lg mx-1 p-3 bg-light">
    <h3>Trends This Week</h3>
    <ul>
      {metrics.map((metric, i) => (
        <li key={i}>
          <strong>{Math.abs(metric.trend)}%</strong>{' '}
          {metric.trend >= 0 ? 'increase' : 'decrease'} in {metric.label}
        </li>
      ))}
    </ul>
  </div>
);

WeeklyTrends.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      trend: PropTypes.number
    })
  ).isRequired
};

export const BlockContent = ({ children }) => (
  <div className="p-3">{children}</div>
);

export const DataRow = ({ children }) => <div className="row">{children}</div>;

export const DataCol = ({ children }) => (
  <div className="col-lg mx-1 mb-3 mb-lg-0 bg-primary">{children}</div>
);

const DataBlock = ({ children }) => (
  <section className="border p-3">{children}</section>
);

export default DataBlock;
