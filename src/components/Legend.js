import React from 'react';

const Legend = ({ legendData }) => (
  <div
    className="border bg-light mt-2 py-2 px-3"
    style={{ fontSize: '0.7rem' }}
  >
    <span className="d-block h5 mb-2">Legend</span>
    <ul className="list-unstyled mb-0 d-flex flex-wrap align-items-center">
      {legendData
        ? legendData.map(category => (
            <li
              className="d-flex align-items-center mb-2 pr-1"
              style={{ width: '10rem' }}
              key={category.name}
            >
              <div
                className="d-inline-block mr-2"
                style={{
                  width: '1.8rem',
                  minWidth: '1.8rem',
                  height: '1.8rem',
                  background: category.color.background
                }}
              ></div>
              <span className="flex-shrink-1 text-break">{category.name}</span>
            </li>
          ))
        : null}
    </ul>
  </div>
);

export default Legend;
