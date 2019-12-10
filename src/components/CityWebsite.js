import React from 'react';

import DataBlock, {
  BlockContent,
  DataRow,
  DataCol
} from 'components/DataBlock';

const CityWebsite = () => (
  <DataBlock
    heading="City Website"
    keyMetrics={[
      { count: 36, label: 'pageviews', trend: 'positive' },
      { count: 'top page:', label: 'election information', trend: 'star' }
    ]}
    introduction="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus."
  >
    <BlockContent>
      <DataRow>
        <DataCol>
          bar chart showing: total views per page within the past day
        </DataCol>
      </DataRow>
    </BlockContent>
  </DataBlock>
);

export default CityWebsite;
