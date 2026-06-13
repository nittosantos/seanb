import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordInput,
  ForgotPasswordResponse,
  LoginInput,
  RegisterInput,
} from '@seanb/shared';
import {
  authResponseSchema,
  forgotPasswordResponseSchema,
} from '@seanb/shared';

export type { AuthResponse, AuthUser, ForgotPasswordResponse };

export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const body: LoginInput = { email, password };

  return apiFetch<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(body),
    schema: authResponseSchema,
  });
}

export async function registerRequest(
  input: RegisterInput,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(input),
    schema: authResponseSchema,
  });
}

export async function forgotPasswordRequest(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResponse> {
  return apiFetch<ForgotPasswordResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    method: 'POST',
    body: JSON.stringify(input),
    schema: forgotPasswordResponseSchema,
  });
}

export async function meRequest(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>(API_ENDPOINTS.AUTH.ME, {
    token,
  });
}
