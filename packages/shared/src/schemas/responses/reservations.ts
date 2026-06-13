import { z } from 'zod';
import { reservationStatusSchema } from '../../enums';

export const guestTripSchema = z.object({
  id: z.string(),
  boatTitle: z.string(),
  boatImage: z.string(),
  slug: z.string(),
  date: z.string(),
  duration: z.string(),
  status: z.enum(['Upcoming', 'Past']),
  price: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  reservationStatus: reservationStatusSchema,
});

export type GuestTrip = z.infer<typeof guestTripSchema>;

export const hostReservationRowSchema = z.object({
  id: z.string(),
  key: z.string(),
  date: z.string(),
  status: z.string(),
  customer: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
  purchased: z.string(),
  revenue: z.string(),
  checked: z.boolean(),
  reservationStatus: reservationStatusSchema,
});

export type HostReservationRow = z.infer<typeof hostReservationRowSchema>;

export const reservationGuestSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  email: z.string().email(),
});

export const reservationListingSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  image: z.string().nullable(),
});

export const reservationDetailSchema = z.object({
  id: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  totalPrice: z.number(),
  nights: z.number(),
  status: reservationStatusSchema,
  listing: reservationListingSummarySchema,
  guest: reservationGuestSchema,
});

export type ReservationDetail = z.infer<typeof reservationDetailSchema>;
