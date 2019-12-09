import React from 'react';

export const KeyMetrics = ({ children }) => (
  <div className="col-4 p-3 bg-dark text-white">
    <h3>Yesterday</h3>
    <ul>
      <li>
        <strong>28</strong> 311 calls
      </li>
      <li>
        <strong>22</strong> work orders opened
      </li>
      <li>
        <strong>16</strong> work orders closed
      </li>
    </ul>
  </div>
);

const DataBlock = ({ children }) => (
  <div className="border p-3">{children}</div>
);

export default DataBlock;
