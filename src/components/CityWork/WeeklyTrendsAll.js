import React from 'react';
import { connect } from 'react-redux';

import { WeeklyTrends } from 'components/DataBlock';
import { getWeeklyTrends } from 'data/cityWork/selectors';

export default connect(state => ({
  metrics: getWeeklyTrends(state)
}))(WeeklyTrends);
