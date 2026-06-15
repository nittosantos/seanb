import { z } from 'zod';
import { userRoleSchema } from '../../enums';
import { paginationMetaSchema } from './common';

export const reviewStarSchema = z.object({
  star: z.number(),
  count: z.number(),
  percent: z.number(),
});

export const reviewStatsSchema = z.object({
  totalReview: z.number(),
  averageRating: z.number(),
  stars: z.array(reviewStarSchema),
});

export type ReviewStats = z.infer<typeof reviewStatsSchema>;

export const listingCardUserSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  slug: z.string(),
});

export const listingCardSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  thumbnail: z.array(z.string()),
  time: z.string(),
  caption: z.string(),
  location: z.string(),
  price: z.string(),
  priceValue: z.number(),
  rating: z.number(),
  ratingCount: z.string(),
  user: listingCardUserSchema,
});

export type ListingCard = z.infer<typeof listingCardSchema>;

export const listingsPaginatedResponseSchema = z.object({
  data: z.array(listingCardSchema),
  meta: paginationMetaSchema,
});

export type ListingsPaginatedResponse = z.infer<
  typeof listingsPaginatedResponseSchema
>;

export const equipmentItemSchema = z.object({
  img: z.string(),
  name: z.string(),
});

export const specificationItemSchema = z.object({
  name: z.string(),
  details: z.string(),
});

export const listingVendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  img: z.string(),
  coverImage: z.string(),
  memberSince: z.string(),
  languages: z.array(z.string()),
  responseRate: z.number(),
  responseTime: z.string(),
  location: z.string(),
  boatName: z.string(),
  boatGuests: z.number(),
  boatCabins: z.number(),
  boatBathrooms: z.number(),
  totalReview: z.number(),
  username: z.string(),
  instagramUserName: z.string(),
  twitterUserName: z.string(),
});

export const listingReviewSchema = z.object({
  avatar: z.string(),
  name: z.string(),
  date: z.string(),
  location: z.string(),
  rating: z.number(),
  review: z.string(),
});

export const listingDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  location: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  gallary: z.array(z.string()),
  duration: z.string().nullable(),
  hasCaptain: z.boolean(),
  caption: z.string(),
  boatType: z.string().nullable(),
  equipment: z.array(equipmentItemSchema),
  specifications: z.array(specificationItemSchema),
  vendor: listingVendorSchema,
  reviewsData: z.object({
    stats: reviewStatsSchema,
    reviews: z.array(listingReviewSchema),
  }),
});

export type ListingDetail = z.infer<typeof listingDetailSchema>;

export const createReviewResponseSchema = listingReviewSchema;

export type CreateReviewResponse = z.infer<typeof createReviewResponseSchema>;
