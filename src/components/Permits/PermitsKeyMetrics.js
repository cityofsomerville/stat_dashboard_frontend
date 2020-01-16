import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import KeyMetrics, { Metric } from 'components/KeyMetrics';
import { getPermitsKeyMetrics } from 'data/permits/selectors';
import { fetchKeyMetrics } from 'data/permits/actions';

const PermitsKeyMetrics = ({ metrics, fetchKeyMetrics }) => {
  useEffect(() => {
    fetchKeyMetrics();
  }, [fetchKeyMetrics]);

  return (
    <KeyMetrics>
      {metrics.map(metric => (
        <Metric
          figure={metric.figure}
          average={metric.average}
          key={metric.type}
        >
          {metric.type} permits issued
        </Metric>
      ))}
    </KeyMetrics>
  );
};

export default connect(
  state => ({
    metrics: getPermitsKeyMetrics(state)
  }),
  {
    fetchKeyMetrics
  }
)(PermitsKeyMetrics);
