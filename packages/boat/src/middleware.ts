import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/config/auth-cookie';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PRIVATE_PATHS = ['/account', '/add-listing', '/trips', '/wishlist'];

function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return '/';
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }

  return pathname;
}

function getLocaleFromPath(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }

  return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = stripLocale(pathname);
  const isPrivate = PRIVATE_PATHS.some(
    (privatePath) =>
      pathWithoutLocale === privatePath ||
      pathWithoutLocale.startsWith(`${privatePath}/`),
  );

  if (isPrivate) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      const locale = getLocaleFromPath(pathname);
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
