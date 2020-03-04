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
            Somerville.
          </p>
        </SectionDescription>
      </SectionHeading>
      <DataRow>
        <DataCol>
          <ChartContainer
            data={chartData}
            chartClass={BarChart}
            name="cityWebsite"
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
