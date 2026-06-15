import { z } from 'zod';
import { userRoleSchema } from '../../enums';
import { authUserSchema } from './auth';
import { reviewStatsSchema } from './listings';

export const userProfileSchema = authUserSchema.extend({
  phone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  streetAddress: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const dashboardStatsSchema = z.object({
  pendingOrders: z.number(),
  totalRevenue: z.number(),
  avgOrderRevenue: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

/** Perfil público do host (GET /users/:identifier) */
export const publicHostProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  username: z.string(),
  coverImage: z.string(),
  memberSince: z.string(),
  languages: z.array(z.string()),
  responseRate: z.number(),
  responseTime: z.string(),
  location: z.string(),
  bio: z.string().nullable(),
  instagramUserName: z.string(),
  twitterUserName: z.string(),
  reviewStats: reviewStatsSchema,
  listingCount: z.number(),
});

export type PublicHostProfile = z.infer<typeof publicHostProfileSchema>;

/** Perfil público mínimo (legado) */
export const publicUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  username: z.string().nullable(),
  role: userRoleSchema.optional(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;
