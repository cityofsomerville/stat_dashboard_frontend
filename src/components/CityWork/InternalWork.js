import React from 'react';
import { connect } from 'react-redux';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import WeeklyTrends from 'components/WeeklyTrends';
import ChartContainer from 'charts/ChartContainer';
import Treemap from 'charts/Treemap';
import {
  getInternalWeeklyTrends,
  getInternalTreemapData
} from 'data/cityWork/selectors';
import { getBaseCategory } from 'data/BaseCategories';

const InternalWork = ({ internalWeeklyTrends, internalTreemapData }) => (
  <BlockContent>
    <p>
      At the same time that they respond to 311 reports, city workers are also
      proactive about finding work that needs to be done, reporting it, and
      completing it. This section explores trends in tickets filed internally
      over the past 7 days. The treemap shows internal tickets completed in the
      last 7 days grouped by department.
    </p>
    <DataRow>
      <DataCol>
        <ChartContainer
          chartClass={Treemap}
          data={internalTreemapData}
          name="internal_treemap"
          cachebust={`${internalTreemapData.length}`}
        />
      </DataCol>
      <WeeklyTrends metrics={internalWeeklyTrends}>
        <h3>Internal Trends</h3>
        <p>
          These categories showed the greatest increase in new tickets filed
          internally this week, compared to the weekly average.
        </p>
      </WeeklyTrends>
    </DataRow>
  </BlockContent>
);

export default connect(state => {
  let internalWeeklyTrends = getInternalWeeklyTrends(state);

  // todo: consider moving this logic to the selector
  // but will the entire images be stored in memory?
  internalWeeklyTrends = internalWeeklyTrends.map(category => {
    const ancestor = getBaseCategory(category.ancestor);
    return {
      ...category,
      img: ancestor.icon,
      alt: ancestor.name
    };
  });
  return {
    internalWeeklyTrends,
    internalTreemapData: getInternalTreemapData(state)
  };
})(InternalWork);
