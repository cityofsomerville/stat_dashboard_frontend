import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import CityWork from 'components/CityWork';
import PublicSafety from 'components/PublicSafety';
import Permits from 'components/Permits';
import CityWebsite from 'components/CityWebsite';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" lang="en" />
    <CityWork />
    <PublicSafety />
    <Permits />
    <CityWebsite />
  </Layout>
);

export default IndexPage;
