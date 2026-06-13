import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type {
  BookedDateRange,
  CreateListingInput,
  CreateReviewInput,
  CreateReviewResponse,
  ListingCard,
  ListingDetail,
  ListingsPaginatedResponse,
  QueryListingsInput,
  SuccessResponse,
  UpdateListingInput,
} from '@seanb/shared';
import { createReviewResponseSchema } from '@seanb/shared';

export type {
  CreateListingInput,
  UpdateListingInput,
  ListingCard,
  ListingDetail,
  ListingsPaginatedResponse,
};

export type ListingsQuery = QueryListingsInput;

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
): Promise<ListingsPaginatedResponse> {
  return apiFetch<ListingsPaginatedResponse>(
    `${API_ENDPOINTS.LISTINGS}${toQueryString(params)}`,
  );
}

export async function fetchListingBySlug(
  slug: string,
): Promise<ListingDetail> {
  return apiFetch<ListingDetail>(API_ENDPOINTS.LISTING_DETAIL(slug));
}

export async function fetchBookedDates(
  slug: string,
): Promise<BookedDateRange[]> {
  return apiFetch<BookedDateRange[]>(
    API_ENDPOINTS.LISTING_BOOKED_DATES(slug),
  );
}

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

export async function updateListing(
  id: string,
  input: UpdateListingInput,
  token: string,
): Promise<ListingCard> {
  return apiFetch<ListingCard>(API_ENDPOINTS.LISTING_BY_ID(id), {
    method: 'PATCH',
    token,
    body: JSON.stringify(input),
  });
}

export async function deleteListing(
  id: string,
  token: string,
): Promise<SuccessResponse> {
  return apiFetch<SuccessResponse>(API_ENDPOINTS.LISTING_BY_ID(id), {
    method: 'DELETE',
    token,
  });
}

export async function createReview(
  slug: string,
  input: CreateReviewInput,
  token: string,
): Promise<CreateReviewResponse> {
  return apiFetch<CreateReviewResponse>(API_ENDPOINTS.REVIEWS(slug), {
    method: 'POST',
    token,
    body: JSON.stringify(input),
    schema: createReviewResponseSchema,
  });
}
