import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import subDays from 'date-fns/subDays';
import startOfToday from 'date-fns/startOfToday';

import DataBlock, {
  BlockContent,
  WeeklyTrends,
  DataRow,
  DataCol
} from 'components/DataBlock';

import CityWorkKeyMetrics from 'components/CityWork/CityWorkKeyMetrics';
import Tabs from 'components/Tabs';
import CityWorkExploreData from 'components/CityWork/CityWorkExploreData';
import Summary from 'components/CityWork/Summary';

import {
  fetchTickets,
  fetchActionsByDay,
  fetchTypesById,
  fetchTypesTickets
} from 'data/cityWork/actions';

const CityWork = ({
  fetchTickets,
  fetchActionsByDay,
  fetchTypesById,
  fetchTypesTickets
}) => {
  useEffect(() => {
    const today = startOfToday();
    // fetchTickets({
    //   startDate: subDays(today, 14),
    //   endDate: today
    // });
    fetchActionsByDay({
      startDate: subDays(today, 7),
      endDate: today
    });
    // fetchTypesById();
    fetchTypesTickets({
      startDate: subDays(today, 14),
      endDate: today
    });
  }, [fetchTickets, fetchActionsByDay, fetchTypesById]);

  return (
    <DataBlock>
      <h2>City Work</h2>
      <div className="row p-3">
        <CityWorkKeyMetrics />
        <div className="col-md-8">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          </p>
        </div>
      </div>
      <Tabs
        uuid="citywork"
        labels={['Summary', 'Explore Data', 'Internal Work', 'In Progress']}
      >
        <Summary />
        <CityWorkExploreData />
        <InternalWork />
        <InProgress />
      </Tabs>
    </DataBlock>
  );
};

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

export default connect(null, {
  fetchTickets,
  fetchActionsByDay,
  fetchTypesById,
  fetchTypesTickets
})(CityWork);
