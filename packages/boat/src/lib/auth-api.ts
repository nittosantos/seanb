import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  role?: string;
  username?: string | null;
  createdAt?: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function meRequest(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>(API_ENDPOINTS.AUTH.ME, {
    token,
  });
}
