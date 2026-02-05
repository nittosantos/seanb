'use client';

import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Routes } from '@/config/routes';

export default function SeeMore({ className }: { className?: string }) {
  const t = useTranslations('common');

  return (
    <Link
      href={Routes.public.explore}
      className={clsx(
        'inline-block whitespace-nowrap pr-4 text-sm font-bold leading-6 text-gray-light underline sm:pr-6 md:text-base lg:pr-0',
        className
      )}
    >
      {t('seeMore')}
    </Link>
  );
}
