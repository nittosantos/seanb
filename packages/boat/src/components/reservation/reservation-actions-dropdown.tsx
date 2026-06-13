'use client';

import { Fragment, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  FlagIcon,
} from '@heroicons/react/24/solid';
import type { HostReservationRow, ReservationStatus } from '@/types/reservations';

type ReservationAction = {
  id: string;
  labelKey: string;
  status: ReservationStatus;
  icon: ReactNode;
};

type ReservationActionsDropdownProps = {
  row: HostReservationRow;
  onAction: (reservationId: string, status: ReservationStatus) => void;
  isUpdating?: boolean;
};

function getActions(status: ReservationStatus): ReservationAction[] {
  switch (status) {
    case 'PENDING':
      return [
        {
          id: 'confirm',
          labelKey: 'confirmReservation',
          status: 'CONFIRMED',
          icon: <CheckCircleIcon className="h-auto w-5 text-green-600" />,
        },
        {
          id: 'cancel',
          labelKey: 'cancelReservation',
          status: 'CANCELLED',
          icon: <XCircleIcon className="h-auto w-5 text-red-500" />,
        },
      ];
    case 'CONFIRMED':
      return [
        {
          id: 'complete',
          labelKey: 'completeReservation',
          status: 'COMPLETED',
          icon: <FlagIcon className="h-auto w-5" />,
        },
        {
          id: 'cancel',
          labelKey: 'cancelReservation',
          status: 'CANCELLED',
          icon: <XCircleIcon className="h-auto w-5 text-red-500" />,
        },
      ];
    default:
      return [];
  }
}

export default function ReservationActionsDropdown({
  row,
  onAction,
  isUpdating = false,
}: ReservationActionsDropdownProps) {
  const t = useTranslations('account');
  const actions = getActions(row.reservationStatus);

  if (actions.length === 0) {
    return null;
  }

  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button
        className="text-gray-dark disabled:opacity-50"
        disabled={isUpdating}
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
        <Menu.Items className="absolute right-0 top-full z-10 min-w-[180px] rounded-lg bg-white shadow-lg xl:mt-2">
          <div className="rounded-lg p-2">
            {actions.map((action) => (
              <Menu.Item key={action.id}>
                {({ active }) => (
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-md p-2 text-left text-sm ${
                      active ? 'bg-gray-lightest' : ''
                    }`}
                    onClick={() => onAction(row.key, action.status)}
                    disabled={isUpdating}
                  >
                    {action.icon}
                    {t(action.labelKey)}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
