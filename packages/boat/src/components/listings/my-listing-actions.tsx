'use client';

import { Fragment, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  ViewfinderCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { Link } from '@/i18n/navigation';
import { Routes } from '@/config/routes';
import type { ListingCard } from '@/types/listings';

type MyListingActionsProps = {
  listing: ListingCard;
  onEdit: (listing: ListingCard) => void;
  onDelete: (listing: ListingCard) => void;
  isDeleting?: boolean;
};

export default function MyListingActions({
  listing,
  onEdit,
  onDelete,
  isDeleting = false,
}: MyListingActionsProps) {
  const t = useTranslations('account');

  return (
    <Menu as="div" className="absolute top-3 right-3 z-20">
      <Menu.Button
        className="rounded-full bg-white/90 p-1.5 text-gray-dark shadow-sm disabled:opacity-50"
        disabled={isDeleting}
      >
        <EllipsisHorizontalIcon className="h-auto w-5" />
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
        <Menu.Items className="absolute right-0 top-full z-10 min-w-[160px] rounded-lg bg-white shadow-lg xl:mt-2 xl:min-w-[192px]">
          <div className="rounded-lg p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-md p-2 text-left text-sm capitalize ${
                    active ? 'bg-gray-lightest' : ''
                  }`}
                  onClick={() => onEdit(listing)}
                >
                  <PencilIcon className="h-auto w-5" />
                  {t('edit')}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={Routes.public.listingDetails(listing.slug)}
                  className={`flex w-full items-center gap-3 rounded-md p-2 text-left text-sm capitalize ${
                    active ? 'bg-gray-lightest' : ''
                  }`}
                >
                  <ViewfinderCircleIcon className="h-auto w-5" />
                  {t('preview')}
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-md p-2 text-left text-sm capitalize ${
                    active ? 'bg-gray-lightest' : ''
                  }`}
                  onClick={() => onDelete(listing)}
                  disabled={isDeleting}
                >
                  <TrashIcon className="h-auto w-5" />
                  {t('delete')}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
