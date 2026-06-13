import { z } from 'zod';

/** Adicionar método de pagamento (planejado — sem API ainda). */
export const addPaymentMethodSchema = z.object({
  fullName: z.string().min(1),
  cardNumber: z.string().min(12).max(12),
  email: z.string().email(),
  ccv: z.string().min(4),
});

export type AddPaymentMethodInput = z.infer<typeof addPaymentMethodSchema>;
