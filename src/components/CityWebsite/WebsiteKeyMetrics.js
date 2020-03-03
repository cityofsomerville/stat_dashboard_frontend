import React from 'react';

import KeyMetrics, { Metric } from 'components/KeyMetrics';
import top_metric from 'images/top_metric.svg';

const WebsiteKeyMetrics = ({ metrics }) => {
  return (
    <KeyMetrics>
      <Metric
        figure={metrics.pageviews.figure}
        average={metrics.pageviews.average}
      >
        total pageviews
      </Metric>
      <Metric figure="top pages:" average={null} icon={top_metric}>
        {metrics.topPage.title}
      </Metric>
    </KeyMetrics>
  );
};

export default WebsiteKeyMetrics;
