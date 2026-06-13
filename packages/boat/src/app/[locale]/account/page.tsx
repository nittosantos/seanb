'use client';

import { useTranslations } from 'next-intl';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import TransactionActivity from '@/components/dashboard/transaction-activity';
import DashboardHero from '@/components/dashboard/dashboard-hero';
import StatCard from '@/components/ui/cards/stat-card';

export default function DashboardPage() {
  const t = useTranslations('account');
  const { stats, isLoading } = useDashboardStats();

  const dashboardCardData = [
    {
      id: 'pending-orders',
      title: t('pendingOrders'),
      order: stats?.pendingOrders ?? 0,
      last: 0,
      price: null,
    },
    {
      id: 'total-revenue',
      title: t('totalRevenue'),
      order: null,
      last: 0,
      price: stats?.totalRevenue ?? 0,
    },
    {
      id: 'avg-revenue',
      title: t('avgOrderRevenue'),
      order: null,
      last: 0,
      price: stats?.avgOrderRevenue ?? 0,
    },
  ];

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <DashboardHero />
      {!isLoading && (
        <div className="mt-8 mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-12 lg:mb-16 2xl:mt-16 2xl:gap-6">
          {dashboardCardData.map((item) => (
            <StatCard key={item.id} data={item} showComparison={false} />
          ))}
        </div>
      )}
      <div>
        <TransactionActivity />
      </div>
    </div>
  );
}
