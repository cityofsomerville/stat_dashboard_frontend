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
    // if (websiteAverages) {
    //   console.log(websiteAverages);
    //   let annualAverage = Object.keys(websiteAverages).map(cat => websiteAverages[cat].avg_pageviews).reduce((memo, n) => (memo + Number(n)), 0);
    //   annualAverage = annualAverage / 365;
    //   console.log(annualAverage);
    // }
    return {
      pageviews: {
        figure: dailyTotals.reduce(
          (memo, page) => memo + Number(page.pageviews),
          0
        )
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
