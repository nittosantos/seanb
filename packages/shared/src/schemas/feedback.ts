import { z } from 'zod';
import { dateStringSchema } from './common';

export const listingReportReasonSchema = z.enum([
  'INACCURATE',
  'NOT_REAL_PLACE',
  'SCAM',
  'OFFENSIVE',
  'OTHER',
]);

export type ListingReportReason = z.infer<typeof listingReportReasonSchema>;

export const reportListingFeedbackSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
});

export type ReportListingFeedbackInput = z.infer<
  typeof reportListingFeedbackSchema
>;

export const createListingReportSchema = reportListingFeedbackSchema.extend({
  reason: listingReportReasonSchema,
});

export type CreateListingReportInput = z.infer<
  typeof createListingReportSchema
>;

export const profileContactSchema = z.object({
  message: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(7),
  remember: z.boolean().optional(),
});

export type ProfileContactInput = z.infer<typeof profileContactSchema>;

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

export const createHostInquirySchema = z
  .object({
    startDate: dateStringSchema,
    endDate: dateStringSchema,
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phoneNumber: z.string().min(7),
    message: z.string().min(1),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type CreateHostInquiryInput = z.infer<typeof createHostInquirySchema>;

export function withContactHostDateOrder<T extends z.ZodTypeAny>(schema: T) {
  return schema.refine(
    (data: ContactHostInput) => data.startDate < data.endDate,
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    },
  );
}

export function mapContactHostFormToCreateInquiry(
  input: ContactHostInput,
): CreateHostInquiryInput {
  return {
    startDate: input.startDate.toISOString(),
    endDate: input.endDate.toISOString(),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phoneNumber: input.phoneNumber,
    message: input.message,
  };
}
