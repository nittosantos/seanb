import { z } from 'zod';

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export const successResponseSchema = z.object({
  success: z.boolean(),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;

export const bookedDateRangeSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
});

export type BookedDateRange = z.infer<typeof bookedDateRangeSchema>;
