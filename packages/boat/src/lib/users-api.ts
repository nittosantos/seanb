import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type { AuthUser } from '@/lib/auth-api';

export type UserProfile = AuthUser & {
  phone?: string | null;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  streetAddress?: string | null;
  state?: string | null;
  zipCode?: string | null;
  birthDate?: string | null;
  gender?: string | null;
};

export type UpdateProfileInput = {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  country?: string;
  city?: string;
  streetAddress?: string;
  state?: string;
  zipCode?: string;
  birthDate?: string;
  gender?: string;
};

export type DashboardStats = {
  pendingOrders: number;
  totalRevenue: number;
  avgOrderRevenue: number;
};

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(API_ENDPOINTS.USERS.ME, { token });
}

export async function updateUserProfile(
  input: UpdateProfileInput,
  token: string,
): Promise<UserProfile> {
  return apiFetch<UserProfile>(API_ENDPOINTS.USERS.ME, {
    method: 'PATCH',
    token,
    body: JSON.stringify(input),
  });
}

export async function changeUserPassword(
  input: { currentPassword: string; newPassword: string },
  token: string,
): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(API_ENDPOINTS.USERS.PASSWORD, {
    method: 'PATCH',
    token,
    body: JSON.stringify(input),
  });
}

export async function fetchDashboardStats(
  token: string,
): Promise<DashboardStats> {
  return apiFetch<DashboardStats>(API_ENDPOINTS.USERS.DASHBOARD, { token });
}
