import React from 'react';

import KeyMetrics, { Metric } from 'components/KeyMetrics';

const WebsiteKeyMetrics = ({ metrics }) => {
  return (
    <KeyMetrics>
      <Metric
        figure={metrics.pageviews.figure}
        average={metrics.pageviews.average}
      >
        total pageviews
      </Metric>
      <Metric figure="top pages:">{metrics.topPage.title}</Metric>
    </KeyMetrics>
  );
};

export default WebsiteKeyMetrics;
