'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  deleteListing,
  fetchListingBySlug,
  fetchMyListings,
  updateListing,
} from '@/lib/listings-api';
import { toListingCardProps } from '@/lib/listing-card-mapper';
import ListingCard from '@/components/ui/cards/listing';
import ListingCardLoader from '@/components/ui/loader/listing-card-loader';
import MyListingActions from '@/components/listings/my-listing-actions';
import EditListingModal from '@/components/listings/edit-listing-modal';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import type { ListingCard } from '@/types/listings';

export default function ListingPage() {
  const t = useTranslations('account');
  const accessToken = useAuthStore((state) => state.accessToken);
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<ListingCard | null>(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadListings = useCallback(async () => {
    if (!accessToken) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchMyListings(accessToken);
      setListings(data);
    } catch {
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const handleEdit = async (listing: ListingCard) => {
    try {
      const detail = await fetchListingBySlug(listing.slug);
      setEditingListing({
        ...listing,
        title: detail.title,
        location: detail.location ?? listing.location,
        priceValue: detail.price,
      });
      setEditingDescription(detail.description ?? '');
    } catch {
      setEditingListing(listing);
      setEditingDescription('');
    }
  };

  const handleDelete = async (listing: ListingCard) => {
    if (!accessToken) return;
    if (!window.confirm(t('deleteListingConfirm'))) return;

    setDeletingId(listing.id);
    try {
      await deleteListing(listing.id, accessToken);
      setListings((current) => current.filter((item) => item.id !== listing.id));
    } catch {
      // keep list on failure
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (values: {
    title: string;
    price: number;
    location: string;
    description: string;
  }) => {
    if (!accessToken || !editingListing) return;

    setIsSaving(true);
    try {
      const updated = await updateListing(
        editingListing.id,
        {
          title: values.title,
          price: values.price,
          location: values.location,
          description: values.description || undefined,
        },
        accessToken,
      );
      setListings((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setEditingListing(null);
    } catch {
      // keep modal open on failure
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-4 md:mt-10 lg:mt-12 xl:mt-16">
        <Text tag="h4" className="text-xl">
          {t('yourListings')}
        </Text>
        <Link href={Routes.private.addListing}>
          <Button size="sm">{t('addListing')}</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ListingCardLoader key={`listing-loader-${index}`} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item, index) => {
            const props = toListingCardProps(item, 'account-listing', index);
            return (
              <div key={item.id} className="relative">
                <MyListingActions
                  listing={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === item.id}
                />
                <ListingCard {...props} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-lighter bg-gray-50 py-16 text-center">
          <Text className="mb-4 text-gray">{t('noListingsYet')}</Text>
          <Link href={Routes.private.addListing}>
            <Button>{t('addListing')}</Button>
          </Link>
        </div>
      )}

      <EditListingModal
        listing={editingListing}
        description={editingDescription}
        isOpen={Boolean(editingListing)}
        isSaving={isSaving}
        onClose={() => {
          setEditingListing(null);
          setEditingDescription('');
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
