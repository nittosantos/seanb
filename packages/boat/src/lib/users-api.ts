import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type {
  ChangePasswordInput,
  DashboardStats,
  SuccessResponse,
  UpdateProfileInput,
  UserProfile,
} from '@seanb/shared';

export type { UpdateProfileInput, ChangePasswordInput, UserProfile, DashboardStats };

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
  input: ChangePasswordInput,
  token: string,
): Promise<SuccessResponse> {
  return apiFetch<SuccessResponse>(API_ENDPOINTS.USERS.PASSWORD, {
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
