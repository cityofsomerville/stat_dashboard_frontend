import React from 'react';
import { connect } from 'react-redux';

import {
  BlockContent,
  DataRow,
  DataCol,
  WeeklyTrends
} from 'components/DataBlock';
import { getInternalWeeklyTrends } from 'data/cityWork/selectors';
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
        {/* chart: pass in internalTreemapData here */}
        treemap showing: internally generated work by category
      </DataCol>
      <WeeklyTrends metrics={internalWeeklyTrends} />
    </DataRow>
  </BlockContent>
);

export default connect(state => {
  let internalWeeklyTrends = getInternalWeeklyTrends(state);
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
    internalTreemapData: []
  };
})(InternalWork);
