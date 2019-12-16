import { connect } from 'react-redux';

import {
  setDatePreset,
  setCategoryPreset,
  setDateRange,
  setCategories
} from 'data/cityWork/actions';
import { getWeeklyTrends } from 'data/cityWork/selectors';
import ExploreData from 'components/ExploreData';

const QUALITY_OF_LIFE = [
  273, // graffiti
  504, // rats
  301 // potholes
];

export default connect(
  state => {
    return {
      selectedDates: state.cityWork.selectedDates,
      selectedCategories: state.cityWork.selectedCategories,

      categoryList: state.cityWork.typesById,
      categoryPresets: {
        'Weekly Trends': getWeeklyTrends(state),
        'Quality of Life': QUALITY_OF_LIFE
      }
    };
  },
  {
    setDatePreset: () => {},
    setCategoryPreset: () => {}
  }
)(ExploreData);
