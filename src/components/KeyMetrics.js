import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import trend_up from 'images/trend_up.svg';
import trend_down from 'images/trend_down.svg';
import trend_same from 'images/trend_same.svg';

export const Metric = ({ figure, average, children }) => {
  let img;
  let trend;
  let modifier;
  const minorThreshold = 0.05; // 5% of average
  const majorThreshold = 0.2; // 20% of average

  if (figure && average) {
    const difference = average - figure;
    if (Math.abs(difference) > majorThreshold * average) {
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

  return (
    <li className="mb-2">
      {/* TODO: skeleton state */}
      <Icon img={img} alt={trend} />
      <div className="d-inline-block align-middle" style={{ lineHeight: 1.2 }}>
        <strong>{figure}</strong> {children}
        <br />
        <small className="font-weight-light">{trend}</small>
      </div>
    </li>
  );
};

const KeyMetrics = ({ children }) => (
  <div className="col-md-4 p-3 mb-3 mb-md-0 bg-dark text-white">
    <h3 class="h4">Yesterday</h3>
    <ul className="list-unstyled">{children}</ul>
  </div>
);

// KeyMetrics.propTypes = {

// };

export default KeyMetrics;
