import React from 'react';
import { connect } from 'react-redux';

import KeyMetrics, { Metric } from 'components/KeyMetrics';
import { getWorkOrderCounts } from 'data/cityWork/selectors';

const CityWorkKeyMetrics = ({ created, closed }) => (
  <KeyMetrics>
    <Metric figure={created.figure} average={created.average}>
      work orders created
    </Metric>
    <Metric figure={closed.figure} average={closed.average}>
      work orders closed
    </Metric>
  </KeyMetrics>
);

export default connect(state => {
  return getWorkOrderCounts(state);
})(CityWorkKeyMetrics);
