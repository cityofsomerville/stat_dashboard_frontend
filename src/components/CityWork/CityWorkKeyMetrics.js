import { connect } from 'react-redux';

import { KeyMetrics } from 'components/DataBlock';
import { getKeyMetrics } from 'data/cityWork/selectors';

import trend_up from 'images/trend_up.svg';
import trend_down from 'images/trend_down.svg';
import trend_same from 'images/trend_same.svg';

const trendImage = delta =>
  delta > 0 ? trend_up : delta < 0 ? trend_down : trend_same;

const trendDescription = delta =>
  delta > 0 ? 'increasing' : delta < 0 ? 'decreasing' : 'no change';

export default connect(state => {
  const keyMetrics = getKeyMetrics(state);
  return {
    // add images and image descriptions for each metric.
    metrics: [
      {
        ...keyMetrics.created,
        label: 'work orders created',
        img: trendImage(keyMetrics.created.delta),
        alt: trendDescription(keyMetrics.created.delta)
      },
      {
        ...keyMetrics.closed,
        label: 'work orders closed',
        img: trendImage(keyMetrics.closed.delta),
        alt: trendDescription(keyMetrics.closed.delta)
      },
      {
        ...keyMetrics.calls,
        label: '311 calls',
        img: trendImage(keyMetrics.calls.delta),
        alt: trendDescription(keyMetrics.calls.delta)
      }
    ],
    summary: `This section provides detailed information
    about the tasks, requests, and improvements handled each day
    by various city departments. Much of this work begins as
    constituent 311 reports submitted online, through the app, or
    over the phone.`
  };
})(KeyMetrics);
