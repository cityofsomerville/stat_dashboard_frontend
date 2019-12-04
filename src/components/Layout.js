/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  // TODO: query for language (if possible) and set here on-the-fly
  return (
    <>
      <a href="#main" className="sr-only sr-only-focusable">
        Skip to main content
      </a>
      <Header />
      <main className="container py-4" id="main">
        {children}
      </main>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
