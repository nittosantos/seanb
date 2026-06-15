'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { isGoogleMapsEnabled } from '@/config/google-maps';

type GoogleMapsState = {
  isLoaded: boolean;
  loadError?: Error;
};

const GoogleMapsContext = createContext<GoogleMapsState>({ isLoaded: false });

const LIBRARIES: ('places')[] = ['places'];

function GoogleMapsLoader({
  apiKey,
  children,
}: {
  apiKey: string;
  children: ReactNode;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const value = useMemo(
    () => ({ isLoaded, loadError }),
    [isLoaded, loadError],
  );

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY?.trim() ?? '';

  if (!isGoogleMapsEnabled) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return <GoogleMapsLoader apiKey={apiKey}>{children}</GoogleMapsLoader>;
}

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}
