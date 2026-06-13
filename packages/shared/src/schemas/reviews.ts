import { z } from 'zod';

/** POST /listings/:slug/reviews (planejado) */
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

/** Modal de review — `message` no form, `comment` na API. */
export const addReviewFormSchema = z.object({
  rating: createReviewSchema.shape.rating,
  message: createReviewSchema.shape.comment,
});

export type AddReviewFormInput = z.infer<typeof addReviewFormSchema>;

export function mapAddReviewFormToCreateReview(
  data: AddReviewFormInput,
): CreateReviewInput {
  return createReviewSchema.parse({
    rating: data.rating,
    comment: data.message,
  });
}
