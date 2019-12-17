import { connect } from 'react-redux';

import { fetchCityWorkExploreData } from 'data/cityWork/actions';
import { getDataSelection } from 'data/cityWork/selectors';
import ExploreData from 'components/ExploreData';

export default connect(
  state => {
    return {
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
      dataSelection: getDataSelection(state)
    };
  },
  {
    fetchData: fetchCityWorkExploreData
  }
)(ExploreData);
