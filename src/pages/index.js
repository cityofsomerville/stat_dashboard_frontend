import React from 'react';

import Layout from 'components/Layout';
import Image from 'components/Image';
import SEO from 'components/SEO';
import CityWork from 'components/CityWork';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <CityWork />
  </Layout>
);

export default IndexPage;
