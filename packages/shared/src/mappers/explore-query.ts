import type { QueryListingsInput } from '../schemas/listings';

/** Maps explore URL params (home search / trip date filter) to listings API query. */
export function mapExploreSearchToListingsQuery(params: {
  location?: string | null;
  boatType?: string | null;
  category?: string | null;
  price?: string | null;
  guests?: string | null;
  withCrew?: string | null;
  departureDate?: string | null;
  returnDate?: string | null;
}): QueryListingsInput {
  const query: QueryListingsInput = {};

  if (params.location) {
    query.location = params.location;
  }

  const boatType = params.boatType ?? params.category;
  if (boatType) {
    query.boatType = boatType;
  }

  if (params.price) {
    const [min, max] = params.price.split('-').map((value) => Number(value));
    if (!Number.isNaN(min)) query.minPrice = min;
    if (!Number.isNaN(max)) query.maxPrice = max;
  }

  if (params.guests) {
    const minGuests = Number(params.guests);
    if (!Number.isNaN(minGuests)) query.minGuests = minGuests;
  }

  if (params.withCrew === 'true') {
    query.hasCaptain = true;
  }

  if (params.departureDate && params.returnDate) {
    query.checkIn = params.departureDate;
    query.checkOut = params.returnDate;
  }

  return query;
}
