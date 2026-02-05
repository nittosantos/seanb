'use client';

import clsx from 'clsx';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/solid';
import { useDrawerState } from '@/stores/drawer-store';
import ActionIcon from '@/components/ui/action-icon';

export default function SideNavButton({ className }: { className?: string }) {
  const [drawerState, setDrawerState] = useDrawerState();

  return (
    <ActionIcon
      variant="text"
      size="sm"
      className={clsx(
        'hidden !w-6 -translate-x-1 !p-0 focus:!ring-0 md:block md:!w-7 2xl:-mt-1 2xl:!w-8',
        className
      )}
      onClick={() =>
        setDrawerState({
          ...drawerState,
          isOpen: true,
          placement: 'left',
          view: 'SIDE_MENU',
        })
      }
    >
      <Bars3CenterLeftIcon className="h-auto w-full" />
    </ActionIcon>
  );
}
