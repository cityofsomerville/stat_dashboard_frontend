import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

export const SectionHeading = ({ children }) => (
  <div className="row p-3">{children}</div>
);

export const SectionDescription = ({ children }) => (
  <div className="col-md-8">{children}</div>
);

export const WeeklyTrends = ({ metrics, description }) => (
  <div className="col-lg mx-1 p-3 bg-light">
    <h3>Trends This Week</h3>
    {description ? <p>{description}</p> : null}
    <ol className="list-unstyled">
      {metrics.map((metric, i) => (
        <li key={i}>
          <Icon img={metric.img} alt={metric.alt} />
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
