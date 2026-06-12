'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useHostReservations } from '@/hooks/use-reservations';
import { reservationColumn } from '@/components/reservation/reservation-col';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Table from '@/components/ui/table';
import type { HostReservationRow } from '@/types/reservations';

type HostReservationsTableProps = {
  title?: string;
  showSearch?: boolean;
};

export default function HostReservationsTable({
  title,
  showSearch = true,
}: HostReservationsTableProps) {
  const t = useTranslations('account');
  const { reservations, isLoading } = useHostReservations();
  const [order, setOrder] = useState('desc');
  const [column, setColumn] = useState('');
  const [data, setData] = useState<HostReservationRow[]>([]);
  const [searchfilter, setSearchFilter] = useState('');
  const [current, setCurrent] = useState(1);
  const pageSize = 10;

  const filteredSource = useMemo(() => {
    if (!searchfilter) return reservations;
    return reservations.filter((item) =>
      item.customer.name.toLowerCase().includes(searchfilter.toLowerCase()),
    );
  }, [reservations, searchfilter]);

  useEffect(() => {
    const start = (current - 1) * pageSize;
    const offset = current * pageSize;
    setData(filteredSource.slice(start, offset));
  }, [filteredSource, current]);

  useEffect(() => {
    setCurrent(1);
  }, [searchfilter]);

  const onSelectAll = useCallback(
    (checked: boolean) => {
      setData((rows) => rows.map((item) => ({ ...item, checked })));
    },
    [],
  );

  const onChange = useCallback((row: HostReservationRow) => {
    setData((rows) =>
      rows.map((item) =>
        item.key === row.key ? { ...item, checked: !item.checked } : item,
      ),
    );
  }, []);

  const onMore = useCallback((_e: unknown, row: HostReservationRow) => {
    console.log('Reservation action', row.key);
  }, []);

  const onHeaderClick = useCallback(
    (value: string) => ({
      onClick: () => {
        setColumn(value);
        setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
        setData((rows) =>
          [...rows].sort((a, b) => {
            const left = String(a[value as keyof HostReservationRow] ?? '');
            const right = String(b[value as keyof HostReservationRow] ?? '');
            return order === 'desc'
              ? left.localeCompare(right)
              : right.localeCompare(left);
          }),
        );
      },
    }),
    [order],
  );

  const columns = useMemo(
    () =>
      reservationColumn(
        t,
        order,
        column,
        onSelectAll,
        onChange,
        onMore,
        onHeaderClick,
      ),
    [t, order, column, onSelectAll, onChange, onMore, onHeaderClick],
  );

  if (isLoading) {
    return null;
  }

  return (
    <div>
      {(title || showSearch) && (
        <div className="mt-8 mb-6 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:mt-10 md:gap-5 lg:mt-12 xl:mt-16 xl:gap-10">
          {title ? (
            <Text tag="h4" className="text-xl">
              {title}
            </Text>
          ) : (
            <span />
          )}
          {showSearch && (
            <Input
              type="text"
              variant="outline"
              placeholder={t('searchByName')}
              startIcon={<MagnifyingGlassIcon className="h-auto w-5" />}
              value={searchfilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              inputClassName="pl-12"
            />
          )}
        </div>
      )}
      <Table
        data={data}
        columns={columns}
        variant="minimal"
        className="text-sm"
      />
      <div className="mt-8 text-center">
        <Pagination
          current={current}
          total={filteredSource.length}
          pageSize={pageSize}
          nextIcon={t('next')}
          prevIcon={t('previous')}
          prevIconClassName="!text-gray-dark"
          nextIconClassName="!text-gray-dark"
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}
