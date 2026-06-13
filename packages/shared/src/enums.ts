import { z } from 'zod';

export const userRoleSchema = z.enum(['GUEST', 'HOST', 'ADMIN']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const reservationStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
]);
export type ReservationStatus = z.infer<typeof reservationStatusSchema>;
