import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type {
  ListingCard,
  ListingDetail,
  ListingsQuery,
  ListingsResponse,
} from '@/types/listings';

function toQueryString(params: ListingsQuery = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function fetchListings(
  params?: ListingsQuery,
): Promise<ListingsResponse> {
  return apiFetch<ListingsResponse>(
    `${API_ENDPOINTS.LISTINGS}${toQueryString(params)}`,
  );
}

export async function fetchListingBySlug(
  slug: string,
): Promise<ListingDetail> {
  return apiFetch<ListingDetail>(API_ENDPOINTS.LISTING_DETAIL(slug));
}

export type CreateListingInput = {
  title: string;
  description?: string;
  price: number;
  location?: string;
  images?: string[];
  boatName?: string;
  boatGuests?: number;
  boatCabins?: number;
  boatBathrooms?: number;
  boatType?: string;
  equipment?: unknown;
  specifications?: unknown;
};

export async function fetchMyListings(token: string): Promise<ListingCard[]> {
  return apiFetch<ListingCard[]>(API_ENDPOINTS.LISTINGS_MINE, { token });
}

export async function createListing(
  input: CreateListingInput,
  token: string,
): Promise<ListingCard> {
  return apiFetch<ListingCard>(API_ENDPOINTS.LISTINGS, {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}
