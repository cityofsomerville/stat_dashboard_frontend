import React, { useState } from 'react';
import cn from 'classnames';

const BASE_URL = 'http://go.somervillema.gov/dashboard';

const Header = () => {
  return (
    <header>
      <div className="bg-success py-3">
        <h1 className="container text-center text-light font-weight-light">
          The City of Somerville's Key Systems Indicators
        </h1>
      </div>
    </header>
  );
};

export default Header;
