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
    PUBLIC: (identifier: string) =>
      `${API_BASE_URL}/users/${encodeURIComponent(identifier)}`,
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
  LISTING_INQUIRIES: (slug: string) =>
    `${API_BASE_URL}/listings/${slug}/inquiries`,
  LISTING_REPORTS: (slug: string) =>
    `${API_BASE_URL}/listings/${slug}/reports`,
  WISHLIST: `${API_BASE_URL}/wishlist`,
  WISHLIST_IDS: `${API_BASE_URL}/wishlist/ids`,
  WISHLIST_ITEM: (listingId: string) =>
    `${API_BASE_URL}/wishlist/${listingId}`,
  // Static data — replaced by API in upcoming phases
  TOP_DESTINATIONS: '/top-destinations.json',
  TOP_BOATS: '/top-boats.json',
  TESTIMONIALS: '/testimonial.json',
  REVIEWS_STATIC: '/listing-details.json',
};
