import { connect } from 'react-redux';

import { WeeklyTrends } from 'components/DataBlock';

export default connect(state => ({
  metrics: state.cityWork.weeklyTrends
}))(WeeklyTrends);
