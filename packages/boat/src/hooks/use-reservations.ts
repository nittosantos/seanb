'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import {
  fetchHostReservations,
  fetchMyTrips,
} from '@/lib/reservations-api';
import type { GuestTrip, HostReservationRow } from '@/types/reservations';

export function useMyTrips() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const [trips, setTrips] = useState<GuestTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isHydrating) return;

    if (!isAuthorized || !accessToken) {
      setTrips([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMyTrips(accessToken);
      setTrips(data);
    } catch {
      setError('Failed to load trips');
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, isAuthorized, isHydrating]);

  useEffect(() => {
    void load();
  }, [load]);

  return { trips, isLoading, error, reload: load };
}

export function useHostReservations() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const [reservations, setReservations] = useState<HostReservationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isHydrating) return;

    if (!isAuthorized || !accessToken) {
      setReservations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchHostReservations(accessToken);
      setReservations(data);
    } catch {
      setError('Failed to load reservations');
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, isAuthorized, isHydrating]);

  useEffect(() => {
    void load();
  }, [load]);

  return { reservations, isLoading, error, reload: load };
}
