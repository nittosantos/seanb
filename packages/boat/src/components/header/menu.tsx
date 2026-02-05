'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import useAuth from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import ProfileMenu from '@/components/header/profile-menu';
import { useModal } from '@/components/modals/context';
import { useIsMounted } from '@/hooks/use-is-mounted';
import Button from '@/components/ui/button';

export default function Menu() {
  const t = useTranslations('common');
  const { openModal } = useModal();
  const { isAuthorized } = useAuth();
  const mounted = useIsMounted();

  const menuItems = [
    { id: 1, labelKey: 'home' as const, path: Routes.public.home },
    { id: 2, labelKey: 'explore' as const, path: Routes.public.explore },
    { id: 3, labelKey: 'pricing' as const, path: Routes.public.pricing },
    { id: 4, labelKey: 'help' as const, path: Routes.public.help },
  ];

  return (
    <nav className="primary-nav hidden items-center justify-between md:flex">
      <ul className="hidden flex-wrap md:flex">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link href={item.path} className="px-5 capitalize text-white">
              {t(item.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
      {mounted ? (
        <>
          {isAuthorized ? (
            <div className="ml-7 flex justify-end">
              <ProfileMenu className="hidden md:block" />
            </div>
          ) : (
            <Button
              onClick={() => openModal('SIGN_IN')}
              className="ml-5 rounded-lg px-6 py-2 text-sm capitalize md:text-base 4xl:px-8 4xl:py-2.5"
            >
              {t('logIn')}
            </Button>
          )}
        </>
      ) : null}
    </nav>
  );
}
