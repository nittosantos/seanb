'use client';

import { StandaloneSearchBox } from '@react-google-maps/api';
import { useGoogleMaps } from '@/components/providers/google-maps-provider';

type QueryStringType = {
  children: React.ReactNode;
  loader?: React.ReactNode;
  onLoad: (ref: any) => void;
  onPlacesChanged: () => void;
};

export default function SearchAutocomplete({
  children,
  loader,
  onLoad,
  onPlacesChanged,
}: QueryStringType) {
  const { isLoaded } = useGoogleMaps();

  return (
    <div className="map_autocomplete">
      {!isLoaded && loader}
      {isLoaded && (
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          {children}
        </StandaloneSearchBox>
      )}
    </div>
  );
}
