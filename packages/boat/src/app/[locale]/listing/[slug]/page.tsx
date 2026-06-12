import { notFound } from 'next/navigation';
import RelatedListingBlock from '@/components/listing-details/related-listings/related-listings-block';
import ListingDetails from '@/components/listing-details/listing-details-block';
import SubscriptionBlock from '@/components/subscription/subscription-block';
import GallaryBlock from '@/components/listing-details/gallary-block';
import { ListingDetailProvider } from '@/contexts/listing-detail-context';
import { getListingBySlug } from '@/lib/listings-api-server';

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  return (
    <ListingDetailProvider value={listing}>
      <div className="container-fluid w-full 3xl:!px-12">
        <GallaryBlock />
        <ListingDetails />
        <RelatedListingBlock />
      </div>
      <SubscriptionBlock sectionClassName="3xl:!px-12 4xl:!px-12" />
    </ListingDetailProvider>
  );
}
