'use client';

import { dashboardCardData } from 'public/data/dashboard';
import TransactionActivity from '@/components/dashboard/transaction-activity';
import DashboardHero from '@/components/dashboard/dashboard-hero';
import StatCard from '@/components/ui/cards/stat-card';

export default function DashboardPage() {
  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <DashboardHero />
      <div className="mt-8 mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-12 lg:mb-16 2xl:mt-16 2xl:gap-6">
        {dashboardCardData.map((item, index) => (
          <StatCard key={`pricing-card-${index}`} data={item} />
        ))}
      </div>
      <div>
        <TransactionActivity />
      </div>
    </div>
  );
}
