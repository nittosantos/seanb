import { z } from 'zod';
import { reservationStatusSchema } from '../enums';
import { dateStringSchema } from './common';

export const createReservationSchema = z.object({
  listingId: z.string().min(1),
  checkIn: dateStringSchema,
  checkOut: dateStringSchema,
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const updateReservationSchema = z.object({
  status: reservationStatusSchema,
});

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
