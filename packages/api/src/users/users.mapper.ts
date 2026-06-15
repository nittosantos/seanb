import { computeReviewStats } from '../listings/listings.mapper';

type PublicHostUserRow = {
  id: string;
  name: string | null;
  avatar: string | null;
  username: string | null;
  memberSince: Date | null;
  languages: string[];
  responseRate: number | null;
  responseTime: string | null;
  location: string | null;
  bio: string | null;
  coverImage: string | null;
  instagramUserName: string | null;
  twitterUserName: string | null;
  listingsAsOwner: { reviews: { rating: number }[] }[];
  _count: { listingsAsOwner: number };
};

function formatMemberSince(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function mapPublicHostProfile(user: PublicHostUserRow) {
  const allReviews = user.listingsAsOwner.flatMap((listing) => listing.reviews);

  return {
    id: user.id,
    name: user.name ?? '',
    avatar: user.avatar ?? '',
    username: user.username ?? '',
    coverImage: user.coverImage ?? '/images/listing-details/cover-image.png',
    memberSince: formatMemberSince(user.memberSince),
    languages: user.languages,
    responseRate: user.responseRate ?? 0,
    responseTime: user.responseTime ?? '',
    location: user.location ?? '',
    bio: user.bio,
    instagramUserName: user.instagramUserName ?? '',
    twitterUserName: user.twitterUserName ?? '',
    reviewStats: computeReviewStats(allReviews),
    listingCount: user._count.listingsAsOwner,
  };
}

function normalizeUsername(identifier: string): string {
  return identifier.startsWith('@') ? identifier : `@${identifier}`;
}

export function buildPublicProfileWhere(identifier: string) {
  const username = normalizeUsername(identifier);

  return {
    OR: [{ id: identifier }, { username }, { username: identifier }],
  };
}
