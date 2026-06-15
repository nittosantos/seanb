import { z } from 'zod';
import { dateStringSchema } from './common';

const listingFieldsSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(1),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  images: z.array(z.string()).optional(),
  boatName: z.string().optional(),
  boatGuests: z.number().min(1).optional(),
  boatCabins: z.number().min(0).optional(),
  boatBathrooms: z.number().min(0).optional(),
  duration: z.string().optional(),
  hasCaptain: z.boolean().optional(),
  equipment: z.unknown().optional(),
  specifications: z.unknown().optional(),
  boatType: z.string().optional(),
});

export const createListingSchema = listingFieldsSchema;

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const updateListingSchema = listingFieldsSchema.partial();

export type UpdateListingInput = z.infer<typeof updateListingSchema>;

/** Modal de edição — campos obrigatórios na UI, subset de UpdateListingInput. */
export const editListingFormSchema = z.object({
  title: createListingSchema.shape.title,
  price: z.coerce.number().pipe(createListingSchema.shape.price),
  location: z.string().min(1),
  description: z.string().optional(),
});

export type EditListingFormInput = z.infer<typeof editListingFormSchema>;

const optionalBooleanQuery = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (value === 'true' || value === true) {
    return true;
  }

  if (value === 'false' || value === false) {
    return false;
  }

  return value;
}, z.boolean().optional());

export const queryListingsSchema = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
    location: z.string().optional(),
    boatType: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minGuests: z.coerce.number().int().min(1).optional(),
    hasCaptain: optionalBooleanQuery,
    excludeSlug: z.string().optional(),
    ownerId: z.string().optional(),
    checkIn: dateStringSchema.optional(),
    checkOut: dateStringSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.checkIn || !data.checkOut) {
      return;
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date range',
        path: ['checkIn'],
      });
      return;
    }

    if (checkIn >= checkOut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Check-out must be after check-in',
        path: ['checkOut'],
      });
    }
  });

export type QueryListingsInput = z.infer<typeof queryListingsSchema>;
