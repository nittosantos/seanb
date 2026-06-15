export const AUTH_COOKIE_NAME = 'seanb-auth-token';

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function readAuthCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const prefix = `${AUTH_COOKIE_NAME}=`;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(prefix.length));
}
