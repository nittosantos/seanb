'use client';

import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from '@/components/providers/google-maps-provider';
import { isGoogleMapsEnabled } from '@/config/google-maps';

interface MapTypes {
  mapContainerClassName?: string;
}

const options = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`${className ?? ''} flex items-center justify-center bg-gray-lighter text-sm text-gray`}
    >
      Map unavailable
    </div>
  );
}

export default function MapView({ mapContainerClassName }: MapTypes) {
  const { isLoaded, loadError } = useGoogleMaps();

  if (!isGoogleMapsEnabled) {
    return <MapPlaceholder className={mapContainerClassName} />;
  }

  if (loadError) {
    return <MapPlaceholder className={mapContainerClassName} />;
  }

  if (!isLoaded) {
    return (
      <div
        className={`${mapContainerClassName ?? ''} flex items-center justify-center bg-gray-lighter text-sm text-gray`}
      >
        Loading...
      </div>
    );
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
