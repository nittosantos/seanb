type ReviewRow = { rating: number };
type ReviewWithUser = {
  rating: number;
  comment: string | null;
  location: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    avatar: string | null;
  };
};

type ListingUser = {
  id: string;
  name: string | null;
  avatar: string | null;
  username: string | null;
  memberSince: Date | null;
  languages: string[];
  responseRate: number | null;
  responseTime: string | null;
  location: string | null;
  coverImage: string | null;
  instagramUserName: string | null;
  twitterUserName: string | null;
};

type ListingRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: { toString(): string } | number;
  location: string | null;
  lat: number | null;
  lng: number | null;
  images: string[];
  boatName: string | null;
  boatGuests: number | null;
  boatCabins: number | null;
  boatBathrooms: number | null;
  duration: string | null;
  hasCaptain: boolean;
  equipment: unknown;
  specifications: unknown;
  boatType: string | null;
  user: ListingUser;
  reviews?: ReviewRow[];
};

function toNumber(value: { toString(): string } | number): number {
  return typeof value === 'number' ? value : Number(value);
}

function formatPrice(value: { toString(): string } | number): string {
  return `$${Math.round(toNumber(value))}`;
}

function captainLabel(hasCaptain: boolean): string {
  return hasCaptain ? 'Captain' : 'No Captain';
}

function formatMemberSince(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatReviewDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function mapListingReview(review: ReviewWithUser) {
  return {
    avatar: review.user.avatar ?? '',
    name: review.user.name ?? '',
    date: formatReviewDate(review.createdAt),
    location: review.location ?? '',
    rating: review.rating,
    review: review.comment ?? '',
  };
}

export function computeReviewStats(reviews: ReviewRow[]) {
  const totalReview = reviews.length;
  const averageRating =
    totalReview === 0
      ? 0
      : Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReview) *
            10,
        ) / 10;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    const percent =
      totalReview === 0 ? 0 : Math.round((count / totalReview) * 100);
    return { count, percent };
  });

  return {
    totalReview,
    averageRating,
    stars: distribution,
  };
}

export function mapListingCard(listing: ListingRow) {
  const stats = computeReviewStats(listing.reviews ?? []);

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    thumbnail: listing.images,
    time: listing.duration ?? '',
    caption: captainLabel(listing.hasCaptain),
    location: listing.location ?? '',
    price: formatPrice(listing.price),
    priceValue: toNumber(listing.price),
    rating: stats.averageRating,
    ratingCount: String(stats.totalReview).padStart(2, '0'),
    user: {
      name: listing.user.name ?? '',
      avatar: listing.user.avatar ?? '',
      slug: `/user/${listing.user.id}`,
    },
  };
}

export function mapListingDetail(
  listing: Omit<ListingRow, 'reviews'> & { reviews: ReviewWithUser[] },
) {
  const stats = computeReviewStats(
    listing.reviews.map((review) => ({ rating: review.rating })),
  );

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description ?? '',
    price: toNumber(listing.price),
    location: listing.location,
    lat: listing.lat,
    lng: listing.lng,
    gallary: listing.images,
    duration: listing.duration,
    hasCaptain: listing.hasCaptain,
    caption: captainLabel(listing.hasCaptain),
    boatType: listing.boatType,
    equipment: listing.equipment ?? [],
    specifications: listing.specifications ?? [],
    vendor: {
      id: listing.user.id,
      name: listing.user.name ?? '',
      img: listing.user.avatar ?? '',
      coverImage: listing.user.coverImage ?? '',
      memberSince: formatMemberSince(listing.user.memberSince),
      languages: listing.user.languages,
      responseRate: listing.user.responseRate ?? 0,
      responseTime: listing.user.responseTime ?? '',
      location: listing.user.location ?? listing.location ?? '',
      boatName: listing.boatName ?? '',
      boatGuests: listing.boatGuests ?? 1,
      boatCabins: listing.boatCabins ?? 0,
      boatBathrooms: listing.boatBathrooms ?? 0,
      totalReview: stats.totalReview,
      username: listing.user.username ?? '',
      instagramUserName: listing.user.instagramUserName ?? '',
      twitterUserName: listing.user.twitterUserName ?? '',
    },
    reviewsData: {
      stats,
      reviews: listing.reviews.map((review) => mapListingReview(review)),
    },
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
