import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

export const KeyMetrics = ({ metrics, summary }) => (
  <div className="row p-3">
    <div className="col-md-4 p-3 mb-3 mb-md-0 bg-dark text-white">
      <h3>Yesterday</h3>
      <ul>
        {metrics.map((metric, i) => (
          <li key={i}>
            {/* TODO: skeleton state */}
            <strong>{metric.figure}</strong> {metric.label} ({metric.delta})
          </li>
        ))}
      </ul>
    </div>
    <div className="col-md-8">
      <p>{summary}</p>
    </div>
  </div>
);

KeyMetrics.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      figure: PropTypes.number,
      label: PropTypes.string,
      delta: PropTypes.number
    })
  ).isRequired,
  summary: PropTypes.string
};

export const WeeklyTrends = ({ metrics, description }) => (
  <div className="col-lg mx-1 p-3 bg-light">
    <h3>Trends This Week</h3>
    {description ? <p>{description}</p> : null}
    <ol className="list-unstyled">
      {metrics.map((metric, i) => (
        <li key={i}>
          <Icon typeId={metric.ancestor} />
          <strong>{Math.abs(metric.trend)}%</strong>{' '}
          {metric.trend >= 0 ? 'increase' : 'decrease'} in {metric.label}
        </li>
      ))}
    </ol>
  </div>
);

WeeklyTrends.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      trend: PropTypes.number
    })
  ).isRequired,
  description: PropTypes.string
};

export const BlockContent = ({ children }) => (
  <div className="p-3">{children}</div>
);

export const DataRow = ({ children }) => <div className="row">{children}</div>;

export const DataCol = ({ children }) => (
  <div className="col-lg mx-1 mb-3 mb-lg-0">{children}</div>
);

const DataBlock = ({ children }) => (
  <section className="border p-3">{children}</section>
);

DataBlock.propTypes = {
  children: PropTypes.node.isRequired
};

export default DataBlock;
