import React from 'react';
import { Map, CircleMarker, Popup, TileLayer } from 'react-leaflet';

const position = [42.3925, -71.10548];

const MapMarker = ({ lat, lng, id, title, date, color }) => (
  <CircleMarker
    radius={6}
    center={{ lat, lng }}
    color={color ? color.background : null}
    fillOpacity={0.5}
    weight={1}
  >
    <Popup>
      <p>
        <strong>Type: </strong>
        {title}
        <br />
        <strong>Date: </strong>
        {date}
      </p>
    </Popup>
  </CircleMarker>
);

const ExploreDataMap = ({ markers }) => (
  <>
    <style type="text/css">{`
      .leaflet-container {
        height: 350px;
        width: 100%;
      }
  `}</style>
    <Map center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="http://tiles.mapc.org/basemap/{z}/{x}/{y}.png"
        attribution='Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>'
      />
      {markers.map(marker => (
        <MapMarker
          key={marker.id}
          lat={marker.latitude}
          lng={marker.longitude}
          id={marker.id}
          title={marker.title}
          date={marker.date}
          color={marker.color}
        />
      ))}
    </Map>
  </>
);

export default ExploreDataMap;
