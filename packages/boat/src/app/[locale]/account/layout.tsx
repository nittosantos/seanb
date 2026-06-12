'use client';

import { useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import DashboardHeader from '@/components/header/dashboard';
import MobileNav from '@/components/ui/mobile-nav';
import Footer from '@/components/footer/footer';

export default function UserLayout({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const { isAuthorized, isHydrating } = useAuth();

  useEffect(() => {
    if (isHydrating) return;

    if (!isAuthorized) {
      router.push(Routes.auth.signIn);
    }
  }, [isAuthorized, isHydrating, router]);

  if (isHydrating) {
    return null;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <DashboardHeader />
      <main className="flex-grow">{children}</main>
      <Footer className="hidden md:block" />
      <MobileNav />
    </>
  );
}
