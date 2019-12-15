import React from 'react';
import { connect } from 'react-redux';

import { KeyMetrics } from 'components/DataBlock';

export default connect(({ cityWork }) => {
  return {
    metrics: [
      { label: 'work orders created', ...cityWork.keyMetrics.created },
      { label: 'work orders closed', ...cityWork.keyMetrics.closed },
      { label: '311 calls', ...cityWork.keyMetrics.calls }
    ]
  };
})(KeyMetrics);
