import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';
import { DATE_PRESETS } from 'data/Constants';

const ExploreData = ({
  // dates
  selectedDates,

  // categories
  categoryList,
  categoryPresets,
  selectedCategories,

  // methods
  setCategoryPreset,
  setDatePreset,
  setCategories,
  setDateRange
}) => {
  return (
    <BlockContent>
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
        ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
        dis parturient montes, nascetur ridiculus mus.
      </p>
      <form>
        <label htmlFor="category">Category</label>
        {/* TODO: aria-describedby explanation of this field */}
        <select
          id="category"
          value={selectedCategories.preset}
          onChange={e => setCategoryPreset(e.target.value)}
        >
          {Object.keys(categoryPresets).map(preset => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
          <option key="Custom..." value="Custom...">
            Custom...
          </option>
        </select>
        <label htmlFor="date_range">Date Range</label>
        <select
          id="date_range"
          value={selectedDates.preset}
          onChange={e => setDatePreset(e.target.value)}
        >
          {Object.keys(DATE_PRESETS).map(preset => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </form>

      <DataRow>
        <DataCol>
          stacked area chart, showing: <br />
          totals in {selectedCategories.preset} <br />
          over the past {selectedDates.preset}
        </DataCol>
        <DataCol>
          map, showing: <br />
          locations of {selectedCategories.preset} <br />
          over the past {selectedDates.preset}. <br />
          some locations may be anonymized.
        </DataCol>
      </DataRow>
    </BlockContent>
  );
};

ExploreData.propTypes = {
  selectedCategories: PropTypes.shape({
    preset: PropTypes.string,
    categories: PropTypes.array
  }),
  selectedDates: PropTypes.shape({
    preset: PropTypes.string,
    range: PropTypes.shape({
      startDate: PropTypes.object,
      endDate: PropTypes.object
    })
  }),
  categoryList: PropTypes.object
};

ExploreData.defaultProps = {
  datePresetSelection: '7 days'
};

export default ExploreData;
