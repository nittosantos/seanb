'use client';

import { useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import AddListingHeader from '@/components/header/add-listing';

export default function ListingLayout({
  children,
}: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const { isAuthorized, isHydrating } = useAuth();

  useEffect(() => {
    if (isHydrating) return;

    if (!isAuthorized) {
      router.push(Routes.auth.signIn);
    }
  }, [isAuthorized, isHydrating, router]);

  if (isHydrating || !isAuthorized) {
    return null;
  }

  return (
    <>
      <AddListingHeader />
      <main className="flex flex-grow flex-col">{children}</main>
    </>
  );
}
