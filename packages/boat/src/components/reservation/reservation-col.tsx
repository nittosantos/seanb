'use client';

import ReservationActionsDropdown from '@/components/reservation/reservation-actions-dropdown';
import Checkbox from '@/components/ui/form-fields/checkbox';
import HeaderCell from '@/components/ui/table/header-cell';
import Avatar from '@/components/ui/avatar';
import Badge from '@/components/ui/badge';
import type { HostReservationRow, ReservationStatus } from '@/types/reservations';

export enum STATUS {
  Received = 'Received',
  Pending = 'Pending',
  Refund = 'Refund',
}

export function getStatus(status: string) {
  if (status === STATUS.Received) {
    return 'success';
  }
  if (status === STATUS.Pending) {
    return 'warning';
  }
  if (status === STATUS.Refund) {
    return 'danger';
  }
}

export const reservationColumn = (
  t: (key: string) => string,
  order: string,
  column: string,
  onSelectAll: (key: boolean) => any,
  onChange: (row: any) => any,
  onAction: (reservationId: string, status: ReservationStatus) => void,
  onHeaderClick: (value: string) => any,
  updatingId?: string | null,
) => [
  {
    title: (
      <HeaderCell
        title={
          <Checkbox
            variant="outline"
            inputClassName="!bg-white focus:!ring-0"
            onChange={(e) => onSelectAll(e.target.checked)}
            iconClassName="bg-gray-dark rounded cursor-pointer"
          />
        }
        className="lg:pl-5"
      />
    ),
    dataIndex: 'checked',
    key: 'checked',
    width: 50,
    render: (checked: boolean, row: any) => (
      <div className="inline-flex cursor-pointer lg:pl-5">
        <Checkbox
          variant="outline"
          checked={row.checked}
          onChange={() => onChange(row)}
          inputClassName="!bg-white focus:!ring-0"
          iconClassName="bg-gray-dark rounded cursor-pointer"
        />
      </div>
    ),
  },
  {
    title: (
      <HeaderCell
        title={t('sl')}
        sortable={true}
        ascending={order === 'asc' && column === 'id'}
      />
    ),
    onHeaderCell: () => onHeaderClick('id'),
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: <HeaderCell title={t('date')} />,
    dataIndex: 'date',
    key: 'date',
    width: 150,
    render: (date: any) => <p className="whitespace-nowrap">{date}</p>,
  },
  {
    title: <HeaderCell title={t('status')} />,
    dataIndex: 'status',
    key: 'status',
    width: 150,
    render: (status: string) => {
      if (!status) return '__';
      const statusKey = status === 'Received' ? 'received' : status === 'Pending' ? 'pending' : 'refund';
      return (
        // @ts-ignore
        <Badge variant="flat" className="uppercase" color={getStatus(status)}>
          {t(statusKey)}
        </Badge>
      );
    },
  },
  {
    title: <HeaderCell title={t('customer')} />,
    dataIndex: 'customer',
    key: 'customer',
    width: 200,
    render: (customer: any) => (
      <div className="flex items-center gap-3">
        <Avatar src={customer.avatar} size="40" />
        <p className="whitespace-nowrap">{customer.name}</p>
      </div>
    ),
  },
  {
    title: <HeaderCell title={t('purchased')} />,
    dataIndex: 'purchased',
    key: 'purchased',
    width: 200,
    render: (purchased: string) => (
      <p className="whitespace-nowrap">{purchased}</p>
    ),
  },
  {
    title: <HeaderCell title={t('revenue')} />,
    dataIndex: 'revenue',
    key: 'revenue',
    width: 100,
    render: (value: string) => <p className="font-bold">${value}</p>,
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    width: 50,
    render: (_value: unknown, row: HostReservationRow) => (
      <div className="flex items-center gap-2">
        <ReservationActionsDropdown
          row={row}
          onAction={onAction}
          isUpdating={updatingId === row.key}
        />
      </div>
    ),
  },
];
