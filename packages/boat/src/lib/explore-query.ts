import type { ListingsQuery } from '@/types/listings';
import { mapExploreSearchToListingsQuery } from '@seanb/shared';

export function parseExploreSearchParams(
  searchParams: URLSearchParams,
): ListingsQuery {
  return mapExploreSearchToListingsQuery({
    location: searchParams.get('location'),
    boatType: searchParams.get('boatType'),
    category: searchParams.get('category'),
    price: searchParams.get('price'),
    guests: searchParams.get('guests'),
    withCrew: searchParams.get('withCrew'),
    departureDate: searchParams.get('departureDate'),
    returnDate: searchParams.get('returnDate'),
  });
}
