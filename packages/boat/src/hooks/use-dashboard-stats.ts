'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { fetchDashboardStats, type DashboardStats } from '@/lib/users-api';

export function useDashboardStats() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (isHydrating) return;

    if (!isAuthorized || !accessToken) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchDashboardStats(accessToken);
      setStats(data);
    } catch {
      setStats({
        pendingOrders: 0,
        totalRevenue: 0,
        avgOrderRevenue: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, isAuthorized, isHydrating]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, isLoading, reload: load };
}
