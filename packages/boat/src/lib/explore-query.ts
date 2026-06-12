import type { ListingsQuery } from '@/types/listings';

export function parseExploreSearchParams(
  searchParams: URLSearchParams,
): ListingsQuery {
  const query: ListingsQuery = {};

  const location = searchParams.get('location');
  if (location) query.location = location;

  const boatType =
    searchParams.get('boatType') ?? searchParams.get('category');
  if (boatType) query.boatType = boatType;

  const price = searchParams.get('price');
  if (price) {
    const [min, max] = price.split('-').map((value) => Number(value));
    if (!Number.isNaN(min)) query.minPrice = min;
    if (!Number.isNaN(max)) query.maxPrice = max;
  }

  const guests = searchParams.get('guests');
  if (guests) {
    const minGuests = Number(guests);
    if (!Number.isNaN(minGuests)) query.minGuests = minGuests;
  }

  const withCrew = searchParams.get('withCrew');
  if (withCrew === 'true') {
    query.hasCaptain = true;
  }

  return query;
}
