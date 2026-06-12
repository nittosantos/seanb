import type {
  EquipmentsTypes,
  ReviewStatsTypes,
  ReviewTypes,
  SpecificationTypes,
  VendorTypes,
} from '@/types';

export type ListingCard = {
  id: string;
  slug: string;
  title: string;
  thumbnail: string[];
  time: string;
  caption: string;
  location: string;
  price: string;
  priceValue: number;
  rating: number;
  ratingCount: string;
  user: {
    name: string;
    avatar: string;
    slug: string;
  };
};

export type ListingsResponse = {
  data: ListingCard[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ListingDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string | null;
  lat: number | null;
  lng: number | null;
  gallary: string[];
  duration: string | null;
  hasCaptain: boolean;
  caption: string;
  boatType: string | null;
  equipment: EquipmentsTypes;
  specifications: SpecificationTypes;
  vendor: VendorTypes & { id: string };
  reviewsData: {
    stats: ReviewStatsTypes;
    reviews: ReviewTypes[];
  };
};

export type ListingsQuery = {
  page?: number;
  limit?: number;
  location?: string;
  boatType?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  hasCaptain?: boolean;
  excludeSlug?: string;
};
