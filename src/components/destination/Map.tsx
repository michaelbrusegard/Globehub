'use client';

import LocationOn from '@material-symbols/svg-400/outlined/location_on.svg';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

type MapProps = {
  coordinates: [number, number];
  popup: string;
};

function Map({ coordinates, popup }: MapProps) {
  const MarkerIcon = useMemo(() => {
    const iconMarkup = renderToString(
      <LocationOn className='size-10 fill-danger' aria-hidden='true' />,
    );
    return new L.DivIcon({
      html: iconMarkup,
      iconAnchor: [20, 40],
      className: '',
    });
  }, []);
  return (
    <MapContainer
      className='aspect-video w-full rounded-md'
      center={coordinates}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={coordinates} icon={MarkerIcon}>
        <Popup>{popup}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
export type { MapProps };
