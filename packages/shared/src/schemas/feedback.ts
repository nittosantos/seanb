import { z } from 'zod';

export const reportListingFeedbackSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
});

export type ReportListingFeedbackInput = z.infer<
  typeof reportListingFeedbackSchema
>;

export const profileContactSchema = z.object({
  message: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(7),
  remember: z.boolean().optional(),
});

export type ProfileContactInput = z.infer<typeof profileContactSchema>;

/** POST contact-host / inquiry (planejado) */
export const contactHostSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(7),
  message: z.string().min(1),
});

export type ContactHostInput = z.infer<typeof contactHostSchema>;

export function withContactHostDateOrder<T extends z.ZodTypeAny>(schema: T) {
  return schema.refine(
    (data: ContactHostInput) => data.startDate < data.endDate,
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    },
  );
}
