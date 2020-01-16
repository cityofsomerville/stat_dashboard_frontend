import React from 'react';
import { connect } from 'react-redux';

import KeyMetrics, { Metric } from 'components/KeyMetrics';
import { getKeyMetrics } from 'data/cityWork/selectors';

const CityWorkKeyMetrics = ({ created, closed, calls }) => (
  <KeyMetrics>
    <Metric figure={created.figure} average={created.average}>
      work orders created
    </Metric>
    <Metric figure={closed.figure} average={closed.average}>
      work orders closed
    </Metric>
    <Metric figure={calls.figure} average={calls.average}>
      311 calls
    </Metric>
  </KeyMetrics>
);

export default connect(state => {
  return getKeyMetrics(state);
})(CityWorkKeyMetrics);
