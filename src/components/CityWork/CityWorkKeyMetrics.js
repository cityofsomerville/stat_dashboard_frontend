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
    ],
    summary: `This section provides detailed information
    about the tasks, requests, and improvements handled each day
    by various city departments. Much of this work begins as
    constituent 311 reports submitted online, through the app, or
    over the phone.`
  };
})(KeyMetrics);
