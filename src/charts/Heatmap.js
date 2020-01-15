import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import { HEATMAP_COLORS } from 'charts/Constants';

const HeatmapCell = ({ value, range }) => {
  const scale = d3
    .scaleQuantize()
    .domain([0, 100])
    .range(HEATMAP_COLORS);

  const style = value ? scale(value) : { background: 'white' };
  return <td style={style}>{value}</td>;
};

const HeatmapRow = ({ name, data, range }) => (
  <tr>
    <th scope="row">{name}</th>
    {data.map(day => (
      <HeatmapCell value={day.tickets.length} range={range} key={day.date} />
    ))}
  </tr>
);

const Heatmap = ({ data }) => (
  <table className="table-hover w-100">
    <thead>
      <tr>
        <th scope="col">Department</th>
        {data.dateRange.map(date => (
          <th>{format(date, 'MMM d')}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Object.keys(data.dataset).map(dept => (
        <HeatmapRow
          name={dept}
          data={data.dataset[dept]}
          range={data.valueRange}
        />
      ))}
    </tbody>
  </table>
);

Heatmap.propTypes = {
  data: PropTypes.shape().isRequired
};

export default Heatmap;
