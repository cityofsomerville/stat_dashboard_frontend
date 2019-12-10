import React from 'react';

import DataBlock, {
  KeyMetrics,
  BlockContent,
  WeeklyTrends,
  DataRow,
  DataCol
} from 'components/DataBlock';
import Tabs from 'components/Tabs';
import ExploreData from 'components/ExploreData';

const CityWork = () => (
  <DataBlock>
    <h2>City Work</h2>
    <div className="row p-3">
      <KeyMetrics
        metrics={[
          { count: 28, label: '311 calls', trend: 'positive' },
          { count: 16, label: 'work orders opened', trend: 'negative' },
          { count: 18, label: 'work orders closed', trend: 'no_change' }
        ]}
      />
      <div className="col-md-8">
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus.
        </p>
      </div>
    </div>
    <Tabs
      uuid="citywork"
      labels={['Summary', 'Explore Data', 'Internal Work', 'In Progress']}
    >
      <Summary />
      <ExploreData />
      <InternalWork />
      <InProgress />
    </Tabs>
  </DataBlock>
);

const Summary = () => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <div className="row">
      <div className="col-lg mx-1 mb-3 mb-lg-0 bg-primary">
        multi series bar chart showing: total work orders opened and total work
        orders closed by day for the past 7 days
      </div>
      <WeeklyTrends
        metrics={[
          { trend: 102, label: 'street sign issue', type: 'street_sign' },
          {
            trend: 65,
            label: 'parking permit inquiry',
            type: 'parking_permit'
          },
          { trend: 23, label: 'rats', type: 'rats' }
        ]}
      />
    </div>
  </BlockContent>
);

const InternalWork = () => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <DataRow>
      <DataCol>treemap showing: internally generated work by category</DataCol>
      <WeeklyTrends
        metrics={[
          { trend: 135, label: 'tree pruning/trimming', type: 'forestry' },
          { trend: 77, label: 'sidewalk repair', type: 'dpw' },
          { trend: 19, label: 'pothole', type: 'dpw' }
        ]}
      />
    </DataRow>
  </BlockContent>
);

const InProgress = () => (
  <BlockContent>
    <p>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <DataRow>
      <DataCol>
        scatterplot showing: open tickets by category vs. average time to close
        for that category (workshop this)
      </DataCol>
    </DataRow>
  </BlockContent>
);

export default CityWork;
