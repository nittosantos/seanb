import type {
  ListingDetail,
  QueryListingsInput,
} from '@seanb/shared';

export type {
  CreateListingInput,
  ListingCard,
  ListingDetail,
  ListingsPaginatedResponse,
} from '@seanb/shared';

/** Query params for GET /listings — shared with the API contract. */
export type ListingsQuery = QueryListingsInput;

/** Aliases legados usados em `@/types` e componentes do template. */
export type EquipmentsTypes = ListingDetail['equipment'];
export type SpecificationTypes = ListingDetail['specifications'];
export type ReviewTypes = ListingDetail['reviewsData']['reviews'][number];
export type ReviewStatsTypes = ListingDetail['reviewsData']['stats'];
export type VendorTypes = Omit<ListingDetail['vendor'], 'id'>;
