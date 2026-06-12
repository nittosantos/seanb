'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchBookedDates } from '@/lib/listings-api';
import {
  parseBookedRanges,
  type BookedDateRange,
} from '@/lib/listing-availability';

export function useListingBookedDates(slug: string) {
  const [bookedRanges, setBookedRanges] = useState<
    ReturnType<typeof parseBookedRanges>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchBookedDates(slug);
      setBookedRanges(parseBookedRanges(data));
    } catch {
      setBookedRanges([]);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  return { bookedRanges, isLoading, reload: load };
}

export type { BookedDateRange };
