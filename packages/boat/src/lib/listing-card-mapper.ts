import type { ListingItemTypes } from '@/types';
import type { ListingCard } from '@/types/listings';

export function toListingCardProps(
  item: ListingCard,
  idPrefix: string,
  index: number,
): ListingItemTypes & { id: string; listingId: string } {
  return {
    id: `${idPrefix}-${index}`,
    listingId: item.id,
    slides: item.thumbnail,
    time: item.time,
    caption: item.caption,
    title: item.title,
    slug: item.slug,
    location: item.location,
    price: item.price,
    rating: item.rating,
    ratingCount: item.ratingCount,
    userAvatar: item.user.avatar,
  };
}
