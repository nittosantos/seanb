'use client';

import { useTranslations } from 'next-intl';

export default function ExploreLoading() {
  const t = useTranslations('explore');
  return (
    <div className="container-fluid mb-12 pt-6 lg:mb-16 animate-pulse">
      {t('loading')}
    </div>
  );
}
