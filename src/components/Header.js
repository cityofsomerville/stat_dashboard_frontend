import React, { useState } from 'react';
import cn from 'classnames';

const BASE_URL = 'http://go.somervillema.gov/dashboard';

const Header = () => {
  const [menuOpen, toggleMenuOpen] = useState(false);

  return (
    <header>
      <div className="navbar navbar-dark navbar-expand-md bg-dark">
        <div className="navbar-inner container">
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={menuOpen}
            aria-label={`${menuOpen ? 'Close' : 'Open'} navigation`}
            onClick={() => toggleMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon text-light"></span>
          </button>
          <div
            className={cn('navbar-collapse', { collapse: !menuOpen })}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav small">
              <li className="nav-item">
                <a
                  className="nav-link py-1 px-3 text-light"
                  href={`${BASE_URL}/index.html`}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-1 px-3 text-light"
                  href={`${BASE_URL}/live.html`}
                >
                  Live
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-1 px-3 text-light"
                  href={`${BASE_URL}/work.html`}
                >
                  Work
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-1 px-3 text-light"
                  href={`${BASE_URL}/play.html`}
                >
                  Play
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-1 px-3 text-light"
                  href={`${BASE_URL}/family.html`}
                >
                  Raise a Family
                </a>
              </li>
              <li className="nav-item active">
                <a
                  className="nav-link py-1 px-3 text-light active"
                  href={`${BASE_URL}/daily.html`}
                >
                  Daily
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link py-1 px-3 text-light"
                  href="http://www.somervillema.gov"
                >
                  City Home
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-success py-3">
        <h1 className="container text-center text-light font-weight-light">
          The City of Somerville's Key Systems Indicators
        </h1>
      </div>
    </header>
  );
};

export default Header;
