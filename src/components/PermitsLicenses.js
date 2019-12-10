import React from 'react';

import DataBlock from 'components/DataBlock';
import ExploreData from 'components/ExploreData';

const PermitsLicenses = () => (
  <DataBlock
    heading="Permits & Licenses"
    keyMetrics={[
      { count: 3, label: 'commercial permits', trend: 'positive' },
      { count: 5, label: 'residential permits', trend: 'negative' }
    ]}
    introduction="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus."
  >
    <ExploreData />
  </DataBlock>
);

export default PermitsLicenses;
