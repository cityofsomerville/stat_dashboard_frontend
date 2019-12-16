import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BlockContent, DataRow, DataCol } from 'components/DataBlock';

const DATE_PRESETS = {
  '7 days': {},
  '30 days': {},
  '3 months': {},
  '1 year': {},
  'Custom...': {}
};

const CATEGORY_PRESETS = {
  'Significant Calls': [],
  'Quality of Life': [],
  'Custom...': []
};

const ExploreData = ({
  datePresetSelection,
  startDate,
  endDate,
  categoryPresetSelection,
  selectedCategories,
  categoryList
}) => {
  const [datePreset, setDatePreset] = useState(datePresetSelection);
  const [categoryPreset, setCategoryPreset] = useState(categoryPresetSelection);

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
          value={categoryPreset}
          onChange={e => setCategoryPreset(e.target.value)}
        >
          {Object.keys(CATEGORY_PRESETS).map(preset => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
        <label htmlFor="date_range">Date Range</label>
        <select
          id="date_range"
          value={datePreset}
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
          totals in {categoryPreset} <br />
          over the past {datePreset}
        </DataCol>
        <DataCol>
          map, showing: <br />
          locations of {categoryPreset} <br />
          over the past {datePreset}. <br />
          some locations may be anonymized.
        </DataCol>
      </DataRow>
    </BlockContent>
  );
};

ExploreData.propTypes = {
  datePresetSelection: PropTypes.string,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  categoryPresetSelection: PropTypes.string,
  selectedCategories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string
    })
  ),
  categoryList: PropTypes.arrayOf(PropTypes.string)
};

ExploreData.defaultProps = {
  datePresetSelection: '7 days'
};

export default ExploreData;
