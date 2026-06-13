import { z } from 'zod';
import { userRoleSchema } from '../../enums';

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  role: userRoleSchema.optional(),
  username: z.string().nullable().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export const authResponseSchema = z.object({
  user: authUserSchema,
  accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const forgotPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ForgotPasswordResponse = z.infer<
  typeof forgotPasswordResponseSchema
>;
