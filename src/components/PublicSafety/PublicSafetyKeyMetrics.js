import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import KeyMetrics, { Metric } from 'components/KeyMetrics';
import { getPublicSafetyKeyMetrics } from 'data/publicSafety/selectors';
import { fetchKeyMetrics } from 'data/publicSafety/actions';

const PublicSafetyKeyMetrics = ({ metrics, fetchKeyMetrics }) => {
  useEffect(() => {
    fetchKeyMetrics();
  }, [fetchKeyMetrics]);

  return (
    <KeyMetrics>
      <Metric figure={metrics.qol.figure} average={metrics.qol.average}>
        quality of life incidents
      </Metric>
      <Metric figure={metrics.ci.figure} average={metrics.ci.average}>
        criminal incidents
      </Metric>
      <Metric figure={metrics.mvc.figure} average={metrics.mvc.average}>
        motor vehicle citations
      </Metric>
      <Metric figure={metrics.te.figure} average={metrics.te.average}>
        traffic enforcement incidents
      </Metric>
    </KeyMetrics>
  );
};

export default connect(
  state => ({
    metrics: getPublicSafetyKeyMetrics(state)
  }),
  {
    fetchKeyMetrics
  }
)(PublicSafetyKeyMetrics);
