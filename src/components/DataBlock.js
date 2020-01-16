import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

export const SectionHeading = ({ children }) => (
  <div className="row p-3">{children}</div>
);

export const SectionDescription = ({ children }) => (
  <div className="col-md-8">{children}</div>
);

export const BlockContent = ({ children }) => (
  <div className="p-3">{children}</div>
);

export const DataRow = ({ children }) => <div className="row">{children}</div>;

export const DataCol = ({ children }) => (
  <div className="col-lg mx-1 mb-3 mb-lg-0">{children}</div>
);

const DataBlock = ({ children }) => (
  <section className="border p-3">{children}</section>
);

DataBlock.propTypes = {
  children: PropTypes.node.isRequired
};

export default DataBlock;
