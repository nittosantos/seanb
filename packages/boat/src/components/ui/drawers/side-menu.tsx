'use client';

import clsx from 'clsx';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  CubeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useDrawerState } from '@/stores/drawer-store';
import ActionIcon from '@/components/ui/action-icon';
import { Routes } from '@/config/routes';
import Logo from '@/components/ui/logo';

const menuItems = [
  { key: 'home' as const, icon: HomeIcon, path: Routes.public.home },
  { key: 'explore' as const, icon: MagnifyingGlassIcon, path: Routes.public.explore },
  { key: 'pricing' as const, icon: CubeIcon, path: Routes.public.pricing },
  { key: 'settings' as const, icon: Cog6ToothIcon, path: Routes.private.accountSettings },
  { key: 'help' as const, icon: InformationCircleIcon, path: Routes.public.help },
];

function NavList() {
  const t = useTranslations('common');
  const pathname = usePathname();
  return (
    <ul className="pt-4">
      {menuItems.map((item) => (
        <li
          key={item.key}
          className="border-b border-gray-lightest last:border-b-0"
        >
          <Link
            href={item.path}
            className={clsx(
              'flex items-center gap-3 py-4 px-10 text-base capitalize text-gray-dark hover:bg-gray-lightest',
              {
                'bg-gray-lightest': pathname === item.path,
              }
            )}
          >
            <item.icon className="h-auto w-5" />
            {t(item.key)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SideMenu() {
  const [drawerState, setDrawerState] = useDrawerState();
  return (
    <div className="ml-auto h-full bg-white md:ml-0">
      <div className="flex h-14 items-center justify-between px-10 pt-6 md:h-20 xl:h-24">
        <Logo className="!text-gray-dark" />
        <ActionIcon
          size="sm"
          variant="outline"
          className="border-none !p-0 focus:!ring-0"
          onClick={() => setDrawerState({ isOpen: false })}
        >
          <XMarkIcon className="h-6 w-6" />
        </ActionIcon>
      </div>
      <NavList />
    </div>
  );
}
