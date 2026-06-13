import { z } from 'zod';

export const bookingGuestSelectionSchema = z.object({
  adults: z.number().min(1),
  child: z.number(),
  pets: z.boolean(),
});

export const bookingFormSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    selected: bookingGuestSelectionSchema,
  })
  .refine(({ startDate, endDate }) => startDate < endDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type BookingFormInput = z.infer<typeof bookingFormSchema>;
