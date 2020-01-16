import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import subDays from 'date-fns/subDays';
import startOfToday from 'date-fns/startOfToday';

import DataBlock, {
  SectionHeading,
  SectionDescription
} from 'components/DataBlock';

import CityWorkKeyMetrics from 'components/CityWork/CityWorkKeyMetrics';
import Tabs from 'components/Tabs';
import CityWorkExploreData from 'components/CityWork/CityWorkExploreData';
import Summary from 'components/CityWork/Summary';
import InternalWork from 'components/CityWork/InternalWork';
import InProgress from 'components/CityWork/InProgress';

import {
  fetchActionsByDay,
  fetchTypesTickets,
  fetchAverages
} from 'data/cityWork/actions';

const CityWork = ({ fetchActionsByDay, fetchTypesTickets, fetchAverages }) => {
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
    fetchAverages();
  }, [fetchActionsByDay, fetchTypesTickets, fetchAverages]);

  return (
    <DataBlock>
      <h2>City Work</h2>
      <SectionHeading>
        <CityWorkKeyMetrics />
        <SectionDescription>
          <p>
            This section provides detailed information about the tasks,
            requests, and improvements handled each day by various city
            departments. Much of this work begins as constituent 311 reports
            submitted online, through the app, or over the phone.
          </p>
        </SectionDescription>
      </SectionHeading>
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

export default connect(null, {
  fetchActionsByDay,
  fetchTypesTickets,
  fetchAverages
})(CityWork);
