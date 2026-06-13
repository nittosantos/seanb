import {
  createListingSchema,
  type CreateListingInput,
} from '@seanb/shared';
import { vendorData } from 'public/data/listing-details';
import type { AddListingStore } from '@/stores/add-listing-store';

const DEFAULT_IMAGES = [
  '/images/top-boats/boat-one.jpg',
  '/images/top-boats/boat-two.jpg',
  '/images/top-boats/boat-three.jpg',
  '/images/top-boats/boat-four.jpg',
];

const SPEC_LABELS: Record<keyof AddListingStore['specification'], string> = {
  engine: 'Engine',
  engineTorque: 'Engine Torque',
  fuelSystem: 'Fuel System',
  boreStroke: 'Bore x Stroke',
  infotainmentSystem: 'Infotainment System',
  displacement: 'Displacement',
  fuelCapacity: 'Fuel Capacity',
  compressionRatio: 'Compression Ratio',
  luggageCapacity: 'Luggage Capacity',
  fuelEconomy: 'Fuel Economy',
  weight: 'Weight',
};

function resolveImages(images: string[]): string[] {
  if (images.length === 0) {
    return [DEFAULT_IMAGES[0]];
  }

  return images.map(
    (url, index) =>
      url.startsWith('blob:')
        ? DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]
        : url,
  );
}

function mapEquipment(names: string[]) {
  return names.map((name) => {
    const match = vendorData.equipment.find((item) => item.name === name);
    return match ?? { img: '/images/listing-details/gps.svg', name };
  });
}

function mapSpecifications(spec: AddListingStore['specification']) {
  return Object.entries(spec)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => ({
      name: SPEC_LABELS[key as keyof AddListingStore['specification']] ?? key,
      details: value,
    }));
}

export function mapAddListingToCreatePayload(
  store: AddListingStore,
): CreateListingInput {
  const payload = {
    title: store.boatName,
    description: store.boatDescription,
    price: store.pricePerDay,
    location: store.location || undefined,
    images: resolveImages(store.images),
    boatName: store.boatName,
    boatGuests: store.guests,
    boatCabins: store.beadRooms || undefined,
    boatBathrooms: store.bathRooms || undefined,
    boatType: store.boatType,
    equipment: mapEquipment(store.equipment),
    specifications: mapSpecifications(store.specification),
  };

  return createListingSchema.parse(payload);
}
