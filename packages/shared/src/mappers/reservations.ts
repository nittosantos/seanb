import {
  createReservationSchema,
  type CreateReservationInput,
} from '../schemas/reservations';

export function mapBookingDatesToCreateReservation(input: {
  listingId: string;
  checkIn: Date;
  checkOut: Date;
}): CreateReservationInput {
  return createReservationSchema.parse({
    listingId: input.listingId,
    checkIn: input.checkIn.toISOString(),
    checkOut: input.checkOut.toISOString(),
  });
}
