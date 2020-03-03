import React from 'react';

const Icon = ({ img, alt, size }) => {
  return (
    <span
      className="d-inline-block align-middle rounded-circle mr-2 mb-2"
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        minWidth: `${size}rem`,
        background: '#c6d9f1'
      }}
    >
      <img className="d-block w-75 mx-auto mt-1" src={img} alt={alt} />
    </span>
  );
};

Icon.defaultProps = {
  size: '2.5'
};

export default Icon;
