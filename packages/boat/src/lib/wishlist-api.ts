import { apiFetch } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api-endpoints';
import {
  successResponseSchema,
  wishlistIdsSchema,
  wishlistListSchema,
  type WishlistIds,
  type WishlistList,
  type SuccessResponse,
} from '@seanb/shared';

export type { WishlistIds, WishlistList };

export function fetchWishlistIds(token: string): Promise<WishlistIds> {
  return apiFetch(API_ENDPOINTS.WISHLIST_IDS, {
    token,
    schema: wishlistIdsSchema,
  });
}

export function fetchWishlist(token: string): Promise<WishlistList> {
  return apiFetch(API_ENDPOINTS.WISHLIST, {
    token,
    schema: wishlistListSchema,
  });
}

export function addToWishlist(
  listingId: string,
  token: string,
): Promise<SuccessResponse> {
  return apiFetch(API_ENDPOINTS.WISHLIST_ITEM(listingId), {
    method: 'POST',
    token,
    schema: successResponseSchema,
  });
}

export function removeFromWishlist(
  listingId: string,
  token: string,
): Promise<SuccessResponse> {
  return apiFetch(API_ENDPOINTS.WISHLIST_ITEM(listingId), {
    method: 'DELETE',
    token,
    schema: successResponseSchema,
  });
}
