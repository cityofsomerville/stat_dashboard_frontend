import React from 'react';
import PropTypes from 'prop-types';

const DepartmentRow = ({ name, data }) => (
  <tr>
    <th scope="row">{name}</th>
    {data.map(day => (
      <td>{day.tickets.length}</td>
    ))}
  </tr>
);

const Heatmap = ({ data }) => (
  <table>
    <caption>I'm a table!</caption>
    <thead>{/*<tr>
        <th scope="col">Department</th>
      </tr>*/}</thead>
    <tbody>
      {Object.keys(data).map(dept => (
        <DepartmentRow name={dept} data={data[dept]} />
      ))}
    </tbody>
  </table>
);

Heatmap.propTypes = {
  data: PropTypes.shape().isRequired
};

export default Heatmap;
