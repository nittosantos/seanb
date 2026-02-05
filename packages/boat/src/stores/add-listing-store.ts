'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialStore = {
  boatName: '',
  boatType: '',
  pricePerDay: 10,
  boatDescription: '',
  beadRooms: 0,
  bathRooms: 0,
  guests: 1,
  location: '',
  phoneNumber: '',
  equipment: [] as string[],
  images: [] as string[],
  specification: {
    engine: '',
    engineTorque: '',
    fuelSystem: '',
    boreStroke: '',
    infotainmentSystem: '',
    displacement: '',
    fuelCapacity: '',
    compressionRatio: '',
    luggageCapacity: '',
    fuelEconomy: '',
    weight: '',
  },
};

export type AddListingStore = typeof initialStore;

interface AddListingState extends AddListingStore {
  step: number;
  setStep: (step: number) => void;
  setStore: (data: Partial<AddListingStore> | ((prev: AddListingStore) => AddListingStore)) => void;
  resetStore: () => void;
}

function getFormFields(state: AddListingState): AddListingStore {
  return {
    boatName: state.boatName,
    boatType: state.boatType,
    pricePerDay: state.pricePerDay,
    boatDescription: state.boatDescription,
    beadRooms: state.beadRooms,
    bathRooms: state.bathRooms,
    guests: state.guests,
    location: state.location,
    phoneNumber: state.phoneNumber,
    equipment: state.equipment,
    images: state.images,
    specification: state.specification,
  };
}

export const useAddListingStore = create<AddListingState>()(
  persist(
    (set) => ({
      ...initialStore,
      step: 1,
      setStep: (step) => set({ step }),
      setStore: (dataOrFn) =>
        set((state) => {
          const formFields = getFormFields(state);
          const update =
            typeof dataOrFn === 'function'
              ? dataOrFn(formFields)
              : dataOrFn;
          return { ...state, ...update };
        }),
      resetStore: () =>
        set((s) => ({
          ...s,
          ...initialStore,
        })),
    }),
    {
      name: 'addNewBoat',
      partialize: (state) => ({
        boatName: state.boatName,
        boatType: state.boatType,
        pricePerDay: state.pricePerDay,
        boatDescription: state.boatDescription,
        beadRooms: state.beadRooms,
        bathRooms: state.bathRooms,
        guests: state.guests,
        location: state.location,
        phoneNumber: state.phoneNumber,
        equipment: state.equipment,
        images: state.images,
        specification: state.specification,
      }),
    }
  )
);

/** Retorna [store, setStore] compatível com o uso nos steps */
export function useAddListingForm(): [
  AddListingStore,
  AddListingState['setStore']
] {
  const store = useAddListingStore(getFormFields);
  const setStore = useAddListingStore((s) => s.setStore);
  return [store, setStore];
}
