import { z } from 'zod';
import { dateStringSchema } from './common';

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  streetAddress: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  birthDate: dateStringSchema.optional(),
  gender: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/** Formulário de perfil — campos de UI mapeados para UpdateProfileInput. */
export const personalInfoFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(7),
  birthDate: z.date().optional(),
  townCity: z.string().optional(),
  zipCode: z.string().optional(),
  bio: z.string().optional(),
  gender: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  streetAddress: z.string().optional(),
  state: z.string().optional(),
});

export type PersonalInfoFormInput = z.infer<typeof personalInfoFormSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
