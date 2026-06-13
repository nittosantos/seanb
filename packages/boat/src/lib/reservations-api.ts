import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type {
  CreateReservationInput,
  GuestTrip,
  HostReservationRow,
  ReservationDetail,
  ReservationStatus,
} from '@seanb/shared';

export type {
  CreateReservationInput,
  ReservationStatus,
  GuestTrip,
  HostReservationRow,
  ReservationDetail,
};

export async function fetchMyTrips(token: string): Promise<GuestTrip[]> {
  return apiFetch<GuestTrip[]>(API_ENDPOINTS.RESERVATIONS, { token });
}

export async function fetchHostReservations(
  token: string,
): Promise<HostReservationRow[]> {
  return apiFetch<HostReservationRow[]>(API_ENDPOINTS.RESERVATIONS_HOST, {
    token,
  });
}

export async function createReservation(
  input: CreateReservationInput,
  token: string,
): Promise<ReservationDetail> {
  return apiFetch<ReservationDetail>(API_ENDPOINTS.RESERVATIONS, {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  token: string,
): Promise<ReservationDetail> {
  return apiFetch<ReservationDetail>(API_ENDPOINTS.RESERVATION(id), {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });
}
