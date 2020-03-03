import React from 'react';

const Icon = ({ img, alt }) => {
  return (
    <span
      className="d-inline-block align-middle rounded-circle mr-2 mb-2"
      style={{
        width: '2.5rem',
        height: '2.5rem',
        minWidth: '2.5rem',
        background: '#c6d9f1'
      }}
    >
      <img className="d-block w-75 mx-auto mt-1" src={img} alt={alt} />
    </span>
  );
};

export default Icon;
