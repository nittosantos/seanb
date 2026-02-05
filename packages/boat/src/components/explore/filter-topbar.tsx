'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useDrawerState } from '@/stores/drawer-store';
import Text from '@/components/ui/typography/text';
import SelectBox from '@/components/ui/select-box';
import Button from '@/components/ui/button';

export default function FilterTopbar() {
  const t = useTranslations('explore');
  const [drawerState, setDrawerState] = useDrawerState();
  const sortingOptions = [
    { id: 'opt-1', label: t('recentlyListed'), checked: true },
    { id: 'opt-2', label: t('previousListed'), checked: true },
    { id: 'opt-3', label: t('newerListed'), checked: true },
  ];
  const [selected, setSelected] = useState(sortingOptions[0]);
  return (
    <div className="mb-8 flex items-center justify-between">
      <Text className="text-sm font-bold text-gray-dark md:text-base">
        {t('showingXOfY', { min: 1, max: 20 })}{' '}
        <Text className="font-normal text-gray" tag="span">
          {t('outOfProducts', { total: 2356 })}{' '}
        </Text>
      </Text>
      <Button
        variant="text"
        type="button"
        className="!p-0 focus:!ring-0 xl:hidden"
        onClick={() =>
          setDrawerState({
            ...drawerState,
            isOpen: true,
            placement: 'right',
            view: 'FILTER_MENU',
          })
        }
      >
        <AdjustmentsHorizontalIcon className="h-auto w-6 lg:w-7" />
      </Button>
      <SelectBox
        value={selected}
        label={t('sortBy')}
        variant="outline"
        options={sortingOptions}
        optionIcon={false}
        arrowIconClassName="!right-2"
        labelClassName="flex-shrink-0"
        className="hidden items-center gap-3 capitalize md:[&>li]:!text-base xl:flex"
        optionsContainerClassName="max-w-[166px] right-0 md:[&>li]:!text-base"
        buttonClassName="!px-4 !py-2 flex justify-between w-full text-base cursor-pointer !pr-10"
        onChange={(data: any) => setSelected(data)}
      />
    </div>
  );
}
