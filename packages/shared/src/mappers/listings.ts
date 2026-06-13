import {
  editListingFormSchema,
  updateListingSchema,
  type EditListingFormInput,
  type UpdateListingInput,
} from '../schemas/listings';

export function mapEditListingFormToUpdateInput(
  data: EditListingFormInput,
): UpdateListingInput {
  return updateListingSchema.parse({
    title: data.title,
    price: data.price,
    location: data.location,
    description: data.description,
  });
}

export function parseEditListingForm(data: unknown): EditListingFormInput {
  return editListingFormSchema.parse(data);
}
