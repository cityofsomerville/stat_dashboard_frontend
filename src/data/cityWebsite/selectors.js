import { createSelector } from 'reselect';

import {
  getStackedAreaChartData,
  selectionTypes,
  legendData,
  groupBy
} from 'data/utils';
import { CHART_COLORS } from 'charts/Constants';

const dailyTotalsSelector = state => state.cityWebsite.dailyTotals;
const websiteAveragesSelector = state => state.cityWebsite.websiteAverages;

export const getCityWebsiteKeyMetrics = createSelector(
  [dailyTotalsSelector, websiteAveragesSelector],
  (dailyTotals, websiteAverages) => {
    const topPages = dailyTotals.slice(0, 5).map(d => d.title);
    let annualAverage = null;
    if (websiteAverages) {
      annualAverage =
        websiteAverages.reduce((memo, d) => memo + Number(d.sum_pageviews), 0) /
        websiteAverages.length;
    }
    return {
      pageviews: {
        figure: dailyTotals.reduce(
          (memo, page) => memo + Number(page.pageviews),
          0
        ),
        average: annualAverage
      },
      topPage: {
        title: topPages.length ? topPages.join(', ') : null
      }
    };
  }
);

export const getChartData = createSelector(dailyTotalsSelector, dailyTotals => {
  return {
    data: dailyTotals.map(d => ({ ...d, pageviews: Number(d.pageviews) })),
    label: 'title',
    figure: 'pageviews'
  };
});
