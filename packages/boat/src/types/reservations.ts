export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type GuestTrip = {
  id: string;
  boatTitle: string;
  boatImage: string;
  slug: string;
  date: string;
  duration: string;
  status: 'Upcoming' | 'Past';
  price: string;
  checkIn: string;
  checkOut: string;
  reservationStatus: ReservationStatus;
};

export type HostReservationRow = {
  id: string;
  key: string;
  date: string;
  status: string;
  customer: {
    name: string;
    avatar: string;
  };
  purchased: string;
  revenue: string;
  checked: boolean;
  reservationStatus: ReservationStatus;
};

export type ReservationDetail = {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  nights: number;
  status: ReservationStatus;
  listing: {
    id: string;
    slug: string;
    title: string;
    image: string | null;
  };
  guest: {
    id: string;
    name: string | null;
    avatar: string | null;
    email: string;
  };
};

export type CreateReservationInput = {
  listingId: string;
  checkIn: string;
  checkOut: string;
};
