'use client';

import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import { Routes } from '@/config/routes';
import { LogoIcon } from '@/components/icons/logo';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      href={Routes.public.home}
      className={clsx(
        'brand-logo inline-flex w-full max-w-[120px] text-black focus:outline-none sm:text-white xl:max-w-[125px] 2xl:max-w-[135px] 3xl:max-w-[150px]',
        className
      )}
    >
      <LogoIcon className="w-full" />
    </Link>
  );
};

export default Logo;
