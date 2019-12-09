import React from 'react';

import DataBlock, { KeyMetrics } from 'components/DataBlock';
import Tabs from 'components/Tabs';

const CityWork = () => (
  <DataBlock>
    <h2>City Work</h2>
    <div className="row p-3">
      <KeyMetrics />
      <div className="col-8">
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus.
        </p>
      </div>
    </div>
    <Tabs
      uuid="citywork"
      labels={['Summary', 'Explore Data', 'Internal Work', 'Upcoming']}
    >
      <div>summary</div>
      <div>explore data</div>
      <div>internal work</div>
      <div>upcoming</div>
    </Tabs>
  </DataBlock>
);

export default CityWork;
