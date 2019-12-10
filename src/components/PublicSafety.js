import React from 'react';

import DataBlock from 'components/DataBlock';
import ExploreData from 'components/ExploreData';

const PublicSafety = () => (
  <DataBlock
    heading="Public Safety"
    keyMetrics={[
      { count: 28, label: 'criminal incidents', trend: 'positive' },
      { count: 16, label: 'quality of life issues', trend: 'negative' }
    ]}
    introduction="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus."
  >
    <ExploreData />
  </DataBlock>
);

export default PublicSafety;
