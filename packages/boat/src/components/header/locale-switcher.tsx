'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type Variant = 'solid' | 'transparent';

const FLAG_CDN = 'https://flagcdn.com';
const FLAG_SIZE_BUTTON = 'w20'; // smaller for button
const FLAG_SIZE_DROPDOWN = 'w40'; // normal for dropdown

const LOCALES = [
  { code: 'pt' as const, label: 'Português', countryCode: 'br' },
  { code: 'en' as const, label: 'English', countryCode: 'us' },
];

export default function LocaleSwitcher({ variant = 'solid' }: { variant?: Variant }) {
  const locale = useLocale();
  const pathname = usePathname();
  const isTransparent = variant === 'transparent';
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const buttonClass = clsx(
    'flex items-center gap-1 rounded-md border px-1.5 py-1 transition-colors',
    isTransparent
      ? 'border-white/40 bg-white/10 hover:bg-white/20 group-[.is-scrolling]:border-gray-200 group-[.is-scrolling]:bg-gray-100 group-[.is-scrolling:hover]:bg-gray-200'
      : 'border-gray-200 bg-gray-100 hover:bg-gray-200'
  );

  const textClass = clsx(
    'text-xs',
    isTransparent
      ? 'text-white group-[.is-scrolling]:text-gray-dark'
      : 'text-gray-dark'
  );

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className={buttonClass} aria-label="Select language">
            <Image
              src={`${FLAG_CDN}/${FLAG_SIZE_BUTTON}/${current.countryCode}.png`}
              alt=""
              width={20}
              height={15}
              className="h-4 w-5 rounded object-cover"
            />
            <ChevronDownIcon
              className={clsx('h-3 w-3 transition-transform', open && 'rotate-180', textClass)}
            />
          </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
          {LOCALES.map((item) => (
            <Menu.Item key={item.code}>
              {({ active }) => (
                <Link
                  href={pathname}
                  locale={item.code}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 text-sm text-gray-dark',
                    active && 'bg-gray-100',
                    locale === item.code && 'bg-gray-50 font-medium'
                  )}
                >
                  <Image
                    src={`${FLAG_CDN}/${FLAG_SIZE_DROPDOWN}/${item.countryCode}.png`}
                    alt=""
                    width={40}
                    height={30}
                    className="h-5 w-7 rounded object-cover"
                  />
                  {item.label}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
        </>
      )}
    </Menu>
  );
}
