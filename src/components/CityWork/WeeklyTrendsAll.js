import React from 'react';
import { connect } from 'react-redux';

import WeeklyTrends from 'components/WeeklyTrends';
import { getBaseCategory } from 'data/BaseCategories';
import { getAllWeeklyTrends } from 'data/cityWork/selectors';

const WeeklyTrendsAll = ({ metrics }) => (
  <WeeklyTrends metrics={metrics}>
    <h3>Trends This Week</h3>
    <p>
      These categories showed the greatest increase in new tickets opened this
      week, compared to the weekly average.
    </p>
  </WeeklyTrends>
);

export default connect(state => ({
  metrics: getAllWeeklyTrends(state).map(category => {
    const ancestor = getBaseCategory(category.ancestor);
    return {
      ...category,
      img: ancestor.icon,
      alt: ancestor.name
    };
  })
}))(WeeklyTrendsAll);
