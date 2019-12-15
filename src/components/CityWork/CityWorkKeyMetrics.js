import { connect } from 'react-redux';

import { KeyMetrics } from 'components/DataBlock';
import { getKeyMetrics } from 'data/cityWork/selectors';

export default connect(state => {
  const keyMetrics = getKeyMetrics(state);
  return {
    metrics: [
      { label: 'work orders created', ...keyMetrics.created },
      { label: 'work orders closed', ...keyMetrics.closed },
      { label: '311 calls', ...keyMetrics.calls }
    ]
  };
})(KeyMetrics);
