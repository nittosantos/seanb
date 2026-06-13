import { z } from 'zod';

/** ISO 8601 date or datetime string (matches Nest class-validator IsDateString). */
export const dateStringSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Invalid date string',
  });
