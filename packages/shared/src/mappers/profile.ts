import type { PersonalInfoFormInput } from '../schemas/users';
import { updateProfileSchema, type UpdateProfileInput } from '../schemas/users';

export function mapPersonalInfoFormToUpdateProfile(
  data: PersonalInfoFormInput,
): UpdateProfileInput {
  return updateProfileSchema.parse({
    name: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    phone: data.phoneNumber,
    bio: data.bio,
    country: data.country,
    city: data.city || data.townCity || undefined,
    streetAddress: data.streetAddress,
    state: data.state,
    zipCode: data.zipCode,
    birthDate: data.birthDate?.toISOString(),
    gender: data.gender,
  });
}
