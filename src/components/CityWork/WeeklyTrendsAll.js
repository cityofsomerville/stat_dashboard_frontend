import { connect } from 'react-redux';

import { WeeklyTrends } from 'components/DataBlock';
import { getBaseCategory } from 'data/BaseCategories';
import { getAllWeeklyTrends } from 'data/cityWork/selectors';

export default connect(state => ({
  metrics: getAllWeeklyTrends(state).map(category => {
    const ancestor = getBaseCategory(category.ancestor);
    return {
      ...category,
      img: ancestor.icon,
      alt: ancestor.name
    };
  }),
  description: `The following categories saw the greatest increase
  in work performed this week, compared to the previous week.`
}))(WeeklyTrends);
