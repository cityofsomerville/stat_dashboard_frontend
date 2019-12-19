import React from 'react';
import { connect } from 'react-redux';

import {
  BlockContent,
  DataRow,
  DataCol,
  WeeklyTrends
} from 'components/DataBlock';
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
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
      ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.
    </p>
    <DataRow>
      <DataCol>
        <ChartContainer
          chartClass={Treemap}
          data={internalTreemapData}
          name="internal_treemap"
          cachebust={internalTreemapData.length}
        />
      </DataCol>
      <WeeklyTrends metrics={internalWeeklyTrends} />
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
    // also need a selector for chart data here
    internalTreemapData: getInternalTreemapData(state)
  };
})(InternalWork);
