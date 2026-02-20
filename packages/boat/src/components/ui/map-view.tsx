'use client';

import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from '@/components/providers/google-maps-provider';

interface MapTypes {
  mapContainerClassName?: string;
}

const options = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

export default function MapView({ mapContainerClassName }: MapTypes) {
  const { isLoaded } = useGoogleMaps();

  if (!isLoaded) {
    return <span>Loading...</span>;
  }

  return (
    <GoogleMap
      mapContainerClassName={mapContainerClassName}
      center={{
        lat: 21.4272,
        lng: 92.0058,
      }}
      zoom={12}
      options={options}
    ></GoogleMap>
  );
}
