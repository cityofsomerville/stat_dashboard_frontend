import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

const Cell = ({ value, range }) => {
  const scale = d3.scaleSequential(d3.interpolateBlues).domain(range);

  return <td style={{ backgroundColor: scale(value) }}>{value}</td>;
};

const DepartmentRow = ({ name, data, range }) => (
  <tr>
    <th scope="row">{name}</th>
    {data.map(day => (
      <Cell value={day.tickets.length} range={range} />
    ))}
  </tr>
);

const Heatmap = ({ data }) => (
  <table>
    <caption>I'm a table!</caption>
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
        <DepartmentRow
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
