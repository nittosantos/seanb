import { ReservationStatus } from '../../generated/prisma/client';

type ReservationWithRelations = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: { toString(): string } | number;
  status: ReservationStatus;
  createdAt: Date;
  listing: {
    id: string;
    slug: string;
    title: string;
    images: string[];
    duration: string | null;
    price: { toString(): string } | number;
  };
  guest: {
    id: string;
    name: string | null;
    avatar: string | null;
    email: string;
  };
};

function toNumber(value: { toString(): string } | number): number {
  return typeof value === 'number' ? value : Number(value);
}

function nightsBetween(checkIn: Date, checkOut: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTripDate(checkIn: Date): string {
  return checkIn.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function mapHostTableStatus(status: ReservationStatus): string {
  switch (status) {
    case ReservationStatus.CONFIRMED:
    case ReservationStatus.COMPLETED:
      return 'Received';
    case ReservationStatus.CANCELLED:
      return 'Refund';
    default:
      return 'Pending';
  }
}

function isUpcoming(reservation: ReservationWithRelations): boolean {
  if (
    reservation.status === ReservationStatus.CANCELLED ||
    reservation.status === ReservationStatus.COMPLETED
  ) {
    return false;
  }

  return reservation.checkOut >= new Date();
}

export function mapGuestTrip(reservation: ReservationWithRelations) {
  const nights = nightsBetween(reservation.checkIn, reservation.checkOut);
  const total = toNumber(reservation.totalPrice);

  return {
    id: reservation.id,
    boatTitle: reservation.listing.title,
    boatImage:
      reservation.listing.images[0] ?? '/images/top-boats/boat-one.jpg',
    slug: reservation.listing.slug,
    date: formatTripDate(reservation.checkIn),
    duration: reservation.listing.duration ?? `${nights} nights`,
    status: isUpcoming(reservation) ? 'Upcoming' : 'Past',
    price: `$${Math.round(total)}`,
    checkIn: reservation.checkIn.toISOString(),
    checkOut: reservation.checkOut.toISOString(),
    reservationStatus: reservation.status,
  };
}

export function mapHostReservationRow(reservation: ReservationWithRelations) {
  const shortId = reservation.id.slice(-6).toUpperCase();

  return {
    id: shortId,
    key: reservation.id,
    date: formatDate(reservation.checkIn),
    status: mapHostTableStatus(reservation.status),
    customer: {
      name: reservation.guest.name ?? reservation.guest.email,
      avatar: reservation.guest.avatar ?? '',
    },
    purchased: reservation.listing.title,
    revenue: toNumber(reservation.totalPrice).toFixed(2),
    checked: false,
    reservationStatus: reservation.status,
  };
}

export function mapReservationDetail(reservation: ReservationWithRelations) {
  const nights = nightsBetween(reservation.checkIn, reservation.checkOut);

  return {
    id: reservation.id,
    checkIn: reservation.checkIn.toISOString(),
    checkOut: reservation.checkOut.toISOString(),
    totalPrice: toNumber(reservation.totalPrice),
    nights,
    status: reservation.status,
    listing: {
      id: reservation.listing.id,
      slug: reservation.listing.slug,
      title: reservation.listing.title,
      image: reservation.listing.images[0] ?? null,
    },
    guest: reservation.guest,
  };
}

export { nightsBetween, toNumber };
