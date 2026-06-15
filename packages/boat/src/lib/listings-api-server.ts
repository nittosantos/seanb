import { API_ENDPOINTS } from '@/config/api-endpoints';
import type { ListingDetail } from '@/types/listings';

export async function getListingBySlug(
  slug: string,
): Promise<ListingDetail | null> {
  let response: Response;

  try {
    response = await fetch(API_ENDPOINTS.LISTING_DETAIL(slug), {
      cache: 'no-store',
    });
  } catch {
    throw new Error(
      'Unable to reach the API. Make sure the backend is running on port 3333.',
    );
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch listing');
  }

  return response.json();
}
