import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

const Trend = ({ img, alt, label, trend }) => (
  <li className="mb-2">
    <Icon img={img} alt={alt} />
    <div className="d-inline-block align-middle" style={{ lineHeight: 1.2 }}>
      <strong>{label}</strong>
      <br />
      <small className="font-weight-light">
        {Math.abs(trend)}% {trend >= 0 ? 'above' : 'below'} average
      </small>
    </div>
  </li>
);

const WeeklyTrends = ({ metrics, children }) => (
  <div className="col-lg mx-1 p-3 bg-light">
    {children}
    <ol className="list-unstyled">
      {metrics.map((metric, i) => (
        <Trend
          key={i}
          img={metric.img}
          alt={metric.alt}
          label={metric.label}
          trend={metric.trend}
        />
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default WeeklyTrends;
