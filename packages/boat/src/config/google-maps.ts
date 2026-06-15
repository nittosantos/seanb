export const isGoogleMapsEnabled = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY?.trim(),
);
