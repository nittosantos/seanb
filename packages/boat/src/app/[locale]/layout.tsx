import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import GalleryCarouselView from '@/components/gallery/view';
import DrawerContainer from '@/components/drawers/view';
import ModalContainer from '@/components/modals/view';
import AuthCookieSync from '@/components/auth/auth-cookie-sync';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthCookieSync />
      {children}
      <ModalContainer />
      <DrawerContainer />
      <GalleryCarouselView />
    </NextIntlClientProvider>
  );
}
