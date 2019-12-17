import { connect } from 'react-redux';

import {
  fetchCityWorkExploreData,
  updateSelectionKey
} from 'data/cityWork/actions';
import { getMapData, getChartData } from 'data/cityWork/selectors';
import ExploreData from 'components/ExploreData';

export default connect(
  state => {
    return {
      namespace: 'citywork',
      selectedCategoryPreset: 'Weekly Trends',
      selectedDatePreset: '7 days',

      categoryList: state.cityWork.typesById,
      categoryPresets: {
        'Weekly Trends': state.cityWork.weeklyTrends.map(trend => trend.type),
        'Quality of Life': [
          273, // graffiti
          504, // rats
          301 // potholes
        ],
        // other presets can be added here if desired! follow the format:
        // 'Preset Name': [ /* ids of categories */ ]
        'Custom...': []
      },
      dataStore: state.cityWork.exploreDataCache,
      selectionKey: state.cityWork.exploreDataKey,
      mapData: getMapData(state),
      chartData: getChartData(state)
    };
  },
  {
    fetchData: fetchCityWorkExploreData,
    updateSelectionKey
  }
)(ExploreData);
