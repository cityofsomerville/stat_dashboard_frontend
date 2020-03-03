import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import DataBlock, {
  SectionHeading,
  SectionDescription,
  DataRow
} from 'components/DataBlock';
import { fetchWebsiteData } from 'data/cityWebsite/actions';
import { getCityWebsiteKeyMetrics } from 'data/cityWebsite/selectors';
import WebsiteKeyMetrics from 'components/CityWebsite/WebsiteKeyMetrics';

const CityWebsite = ({ fetchWebsiteData, keyMetrics }) => {
  useEffect(() => {
    fetchWebsiteData();
  }, [fetchWebsiteData]);

  return (
    <DataBlock>
      <h2>City Website</h2>
      <SectionHeading>
        <WebsiteKeyMetrics metrics={keyMetrics} />
        <SectionDescription>
          <p>
            Residents, visitors, and workers use the city website to find
            information about living, visiting, and doing business in
            Somerville.
          </p>
        </SectionDescription>
      </SectionHeading>
    </DataBlock>
  );
};

export default connect(
  state => ({
    keyMetrics: getCityWebsiteKeyMetrics(state)
  }),
  {
    fetchWebsiteData
  }
)(CityWebsite);
