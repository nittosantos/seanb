'use client';

import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Routes } from '@/config/routes';

const menuItems = [
  { labelKey: 'home' as const, path: Routes.public.home },
  { labelKey: 'explore' as const, path: Routes.public.explore },
  { labelKey: 'pricing' as const, path: Routes.public.pricing },
  { labelKey: 'help' as const, path: Routes.public.help },
];

export default function Footer({ className }: { className?: string }) {
  const t = useTranslations('common');

  return (
    <footer>
      <div className={clsx('container-fluid mb-4', className)}>
        <div className="flex flex-col md:mb-6 md:flex-row md:items-center md:justify-between md:border-t md:border-t-gray-lighter md:pt-6 lg:mb-8 lg:pt-8">
          <div className="order-2 pt-4 md:order-none md:pt-0 lg:shrink-0">
            <p className="text-center text-sm font-normal capitalize leading-6 text-gray-dark md:text-left 3xl:text-base">
              Copyright &copy; {new Date().getFullYear()}{' '}
              <a
                href="https://redq.io/"
                rel="noreferrer noopener"
                target="_blank"
                className="font-semibold hover:underline"
              >
                RedQ Inc.
              </a>{' '}
              {t('copyright')}
            </p>
          </div>
          <nav className="order-1 border-b border-gray-lighter pb-4 md:order-none md:border-b-0 md:pb-0">
            <ul className="flex flex-wrap items-center justify-center md:justify-end">
              {menuItems.map((item) => (
                <li
                  key={item.labelKey}
                  className="px-4 first:pl-0 last:pr-0 lg:px-6"
                >
                  <Link
                    href={item.path}
                    className="block text-sm font-normal capitalize leading-4 text-primary 3xl:text-base"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
