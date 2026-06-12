import { API_ENDPOINTS } from '@/config/api-endpoints';
import type { ListingDetail } from '@/types/listings';

export async function getListingBySlug(
  slug: string,
): Promise<ListingDetail | null> {
  const response = await fetch(API_ENDPOINTS.LISTING_DETAIL(slug), {
    cache: 'no-store',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch listing');
  }

  return response.json();
}
