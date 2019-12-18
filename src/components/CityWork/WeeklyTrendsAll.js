import { connect } from 'react-redux';

import { WeeklyTrends } from 'components/DataBlock';
import BaseCategories, { DEFAULT_ANCESTOR_ID } from 'data/BaseCategories';

export default connect(state => ({
  metrics: state.cityWork.weeklyTrends.map(category => {
    const ancestor =
      BaseCategories[category.ancestor] || BaseCategories[DEFAULT_ANCESTOR_ID];
    return {
      ...category,
      img: ancestor.icon,
      alt: ancestor.name
    };
  }),
  description: `The following categories saw the greatest increase
  in work performed this week, compared to the previous week.`
}))(WeeklyTrends);
