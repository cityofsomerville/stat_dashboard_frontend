import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import subDays from 'date-fns/subDays';
import startOfToday from 'date-fns/startOfToday';

import DataBlock, {
  BlockContent,
  DataRow,
  DataCol
} from 'components/DataBlock';

import CityWorkKeyMetrics from 'components/CityWork/CityWorkKeyMetrics';
import Tabs from 'components/Tabs';
import CityWorkExploreData from 'components/CityWork/CityWorkExploreData';
import Summary from 'components/CityWork/Summary';
import InternalWork from 'components/CityWork/InternalWork';

import { fetchActionsByDay, fetchTypesTickets } from 'data/cityWork/actions';

const CityWork = ({ fetchActionsByDay, fetchTypesTickets }) => {
  useEffect(() => {
    const today = startOfToday();
    fetchActionsByDay({
      startDate: subDays(today, 7),
      endDate: today
    });
    fetchTypesTickets({
      startDate: subDays(today, 14),
      endDate: today
    });
  }, [fetchActionsByDay, fetchTypesTickets]);

  return (
    <DataBlock>
      <h2>City Work</h2>
      <CityWorkKeyMetrics />
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
  fetchActionsByDay,
  fetchTypesTickets
})(CityWork);
