import { connect } from 'react-redux';

import { WeeklyTrends } from 'components/DataBlock';

export default connect(state => ({
  metrics: state.cityWork.weeklyTrends,
  description: `The following categories saw the greatest increase
  in work performed this week, compared to the previous week.`
}))(WeeklyTrends);
