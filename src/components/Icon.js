import React from 'react';

import animals_pets from 'images/animals_pets.svg';
import BaseCategories from 'data/BaseCategories';

const Icon = ({ typeId }) => {
  const category = BaseCategories[typeId];
  return (
    <span
      className="d-inline-block align-middle rounded-circle mr-2 mb-2"
      style={{
        width: '2.5rem',
        height: '2.5rem',
        background: 'rgba(0,100,200,0.2)'
      }}
    >
      <img className="d-block w-75 mx-auto mt-1" src={category.icon} alt="" />
    </span>
  );
};

export default Icon;
