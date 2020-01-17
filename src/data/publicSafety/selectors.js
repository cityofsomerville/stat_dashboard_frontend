import { createSelector } from 'reselect';

import { getStackedAreaChartData } from 'data/utils';

const dailyTotalsSelector = state => state.publicSafety.dailyTotals;

export const getPublicSafetyKeyMetrics = createSelector(
  dailyTotalsSelector,
  dailyTotals => {
    let metrics = {
      qol: { figure: null, average: null },
      ci: { figure: null, average: null },
      mvc: { figure: null, average: null },
      te: { figure: null, average: null }
    };
    Object.keys(dailyTotals).forEach(key => {
      metrics[key].figure = dailyTotals[key];
    });
    return metrics;
  }
);
