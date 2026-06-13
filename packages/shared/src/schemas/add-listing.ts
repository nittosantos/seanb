import { z } from 'zod';
import { createListingSchema } from './listings';

const {
  title,
  price,
  boatGuests,
  boatCabins,
  boatBathrooms,
} = createListingSchema.shape;

/** Wizard step 2 — field names do store, regras alinhadas ao POST /listings. */
export const addListingBoatInfoSchema = z.object({
  boatName: title,
  boatType: z.string().min(1),
  pricePerDay: price,
  boatDescription: z.string().min(1).max(450),
  beadRooms: boatCabins.optional(),
  bathRooms: boatBathrooms.optional(),
  guests: boatGuests.unwrap(),
});

export type AddListingBoatInfoInput = z.infer<typeof addListingBoatInfoSchema>;

export const addListingSpecificationSchema = z.object({
  engine: z.string(),
  engineTorque: z.string(),
  fuelSystem: z.string(),
  boreStroke: z.string(),
  infotainmentSystem: z.string(),
  displacement: z.string(),
  fuelCapacity: z.string(),
  compressionRatio: z.string(),
  luggageCapacity: z.string(),
  fuelEconomy: z.string(),
  weight: z.string(),
});

export type AddListingSpecificationInput = z.infer<
  typeof addListingSpecificationSchema
>;

/** Wizard step 4 — telefone é só UI; location vai para POST /listings. */
export const addListingLocationSchema = z.object({
  phoneNumber: z.string().min(7),
  location: createListingSchema.shape.location,
});

export type AddListingLocationInput = z.infer<typeof addListingLocationSchema>;

export const addListingEquipmentSchema = z.object({
  equipment: z.array(z.string()).min(5),
});

export type AddListingEquipmentInput = z.infer<typeof addListingEquipmentSchema>;
