import React from 'react';

const Footer = () => (
  <footer className="bg-light border-top py-4 text-center">
    <div className="container">
      <p>
        Somerville Systems : Daniel Hadley, Emily Monea, & Skye Stewart |{' '}
        <a
          href="https://github.com/cityofsomerville/stat_dashboard_frontend"
          rel="noopener noreferrer"
          target="_blank"
        >
          Code
        </a>
        <br />
        Posted %FIXME% by %FIXME%
        <br />
        <a href="mailto:mmastrobuoni@somervillema.gov">Contact us</a> with
        questions, requests, and suggestions.
      </p>
      <p>
        <img
          src="data:image/png;base64,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"
          alt="Somerville City Seal"
        />
      </p>
    </div>
  </footer>
);

export default Footer;
