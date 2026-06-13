export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  USERS: {
    ME: `${API_BASE_URL}/users/me`,
    PASSWORD: `${API_BASE_URL}/users/me/password`,
    DASHBOARD: `${API_BASE_URL}/users/me/dashboard`,
  },
  LISTINGS: `${API_BASE_URL}/listings`,
  LISTINGS_MINE: `${API_BASE_URL}/listings/mine`,
  LISTING_DETAIL: (slug: string) => `${API_BASE_URL}/listings/${slug}`,
  LISTING_BOOKED_DATES: (slug: string) =>
    `${API_BASE_URL}/listings/${slug}/booked-dates`,
  LISTING_BY_ID: (id: string) => `${API_BASE_URL}/listings/${id}`,
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
