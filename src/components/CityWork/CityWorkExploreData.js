import { connect } from 'react-redux';

import { fetchCityWorkExploreData } from 'data/cityWork/actions';
import {
  getMapData,
  getChartData,
  getCategoryNames,
  getAllWeeklyTrends,
  getCategoryHierarchy
} from 'data/cityWork/selectors';
import ExploreData from 'components/ExploreData';

export default connect(
  state => {
    const hierarchy = getCategoryHierarchy(state);
    return {
      namespace: 'citywork',
      selectedCategoryPreset: 'Weekly Trends',
      selectedDatePreset: '7 days',

      categoryList: state.cityWork.typesById,
      categoryPresets: {
        'Weekly Trends': getAllWeeklyTrends(state).map(trend => trend.type),
        'Quality of Life': [
          273, // graffiti
          504, // rats
          301 // potholes
        ],
        ...hierarchy
        // other presets can be added here if desired! follow the format:
        // 'Preset Name': [ /* ids of categories */ ]

        // TODO: fix this!
        //'Custom...': []
      },
      params: state.cityWork.exploreDataKey,
      mapData: getMapData(state),
      chartData: getChartData(state),
      typesById: state.cityWork.typesById,
      selectedCategoryNames: getCategoryNames(state)
    };
  },
  {
    fetchData: fetchCityWorkExploreData
  }
)(ExploreData);
