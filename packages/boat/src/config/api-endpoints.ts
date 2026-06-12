export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  LISTINGS: `${API_BASE_URL}/listings`,
  LISTING_DETAIL: (slug: string) => `${API_BASE_URL}/listings/${slug}`,
  RESERVATIONS: `${API_BASE_URL}/reservations`,
  RESERVATIONS_HOST: `${API_BASE_URL}/reservations/host`,
  RESERVATION: (id: string) => `${API_BASE_URL}/reservations/${id}`,
  REVIEWS: (slug: string) => `${API_BASE_URL}/listings/${slug}/reviews`,
  // Static data — replaced by API in upcoming phases
  TOP_DESTINATIONS: '/top-destinations.json',
  TOP_BOATS: '/top-boats.json',
  TESTIMONIALS: '/testimonial.json',
  REVIEWS_STATIC: '/listing-details.json',
};
