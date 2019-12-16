import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Header from 'components/Header';
import Footer from 'components/Footer';
import store from 'data/store';

const Layout = ({ children }) => {
  // TODO: query for language (if possible) and set here on-the-fly
  return (
    <Provider store={store}>
      <a href="#main" className="sr-only sr-only-focusable">
        Skip to main content
      </a>
      <Header />
      <main className="container py-4" id="main">
        {children}
      </main>
      <Footer />
    </Provider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
