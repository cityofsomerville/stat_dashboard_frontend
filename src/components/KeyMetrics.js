import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import trend_up from 'images/trend_up.svg';
import trend_down from 'images/trend_down.svg';
import trend_same from 'images/trend_same.svg';

export const Metric = ({ figure, average, children, icon }) => {
  let img;
  let trend;
  let modifier;
  const step = 3; // difference of under 3 shouldn't count as "significant"
  const minorThreshold = 0.1; // 10% of average
  const majorThreshold = 0.25; // 25% of average

  if (figure !== null && average !== null) {
    const difference = average - figure;
    if (Math.abs(difference) > Math.max(majorThreshold * average, step)) {
      modifier = 'significantly';
    } else {
      modifier = 'slightly';
    }

    if (figure > average + minorThreshold * average) {
      img = trend_up;
      trend = `${modifier} above average`;
    } else if (figure < average - minorThreshold * average) {
      img = trend_down;
      trend = `${modifier} below average`;
    } else {
      img = trend_same;
      trend = 'about average';
    }
  }

  if (icon) {
    img = icon;
  }

  return (
    <li className="mb-2 d-flex">
      {/* TODO: skeleton state */}
      <Icon img={img} alt="" size="2" />
      <div className="d-inline-block align-middle" style={{ lineHeight: 1.2 }}>
        <strong>{figure}</strong> {children}
        <br />
        <small className="font-weight-light">{trend}</small>
      </div>
    </li>
  );
};

Metric.propTypes = {
  figure: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  average: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

const KeyMetrics = ({ children }) => (
  <div className="col-md-4 p-3 mb-3 mb-md-0 bg-dark text-white">
    <h3 className="h4">Yesterday</h3>
    <ul className="list-unstyled">{children}</ul>
  </div>
);

KeyMetrics.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default KeyMetrics;
