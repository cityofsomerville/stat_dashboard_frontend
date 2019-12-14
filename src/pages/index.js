import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import CityWork from 'components/CityWork';
import PublicSafety from 'components/PublicSafety';
import PermitsLicenses from 'components/PermitsLicenses';
import CityWebsite from 'components/CityWebsite';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <CityWork />
    {/*<PublicSafety />
    <PermitsLicenses />
    <CityWebsite />*/}
  </Layout>
);

export default IndexPage;
