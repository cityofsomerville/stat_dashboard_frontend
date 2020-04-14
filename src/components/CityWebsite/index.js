import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import DataBlock, {
  SectionHeading,
  SectionDescription,
  DataRow,
  DataCol
} from 'components/DataBlock';
import { fetchWebsiteData } from 'data/cityWebsite/actions';
import {
  getCityWebsiteKeyMetrics,
  getChartData
} from 'data/cityWebsite/selectors';
import WebsiteKeyMetrics from 'components/CityWebsite/WebsiteKeyMetrics';
import BarChart from 'charts/BarChart';
import ChartContainer from 'charts/ChartContainer';

const CityWebsite = ({ fetchWebsiteData, keyMetrics, chartData }) => {
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
            Somerville. Explore{' '}
            <a href="https://data.somervillema.gov/City-Services/Somerville_Analytics/754v-8e35">
              the full analytics dataset here
            </a>
            .
          </p>
        </SectionDescription>
      </SectionHeading>
      <DataRow>
        <DataCol>
          <ChartContainer
            data={chartData}
            chartClass={BarChart}
            name="cityWebsite"
            title="Top Pages by Number of Views"
            description="Displaying the top 20 city website pages within the past day, sorted in descending order by number of views."
            cachebust={chartData}
          />
        </DataCol>
      </DataRow>
    </DataBlock>
  );
};

export default connect(
  state => ({
    keyMetrics: getCityWebsiteKeyMetrics(state),
    chartData: getChartData(state)
  }),
  {
    fetchWebsiteData
  }
)(CityWebsite);
