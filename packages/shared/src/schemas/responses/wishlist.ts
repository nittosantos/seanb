import { z } from 'zod';
import { listingCardSchema } from './listings';

export const wishlistIdsSchema = z.object({
  ids: z.array(z.string()),
});

export type WishlistIds = z.infer<typeof wishlistIdsSchema>;

export const wishlistListSchema = z.array(listingCardSchema);

export type WishlistList = z.infer<typeof wishlistListSchema>;
