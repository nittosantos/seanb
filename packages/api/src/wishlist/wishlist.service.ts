import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapListingCard } from '../listings/listings.mapper';

const listingInclude = {
  user: {
    select: {
      id: true,
      name: true,
      avatar: true,
      username: true,
      memberSince: true,
      languages: true,
      responseRate: true,
      responseTime: true,
      location: true,
      coverImage: true,
      instagramUserName: true,
      twitterUserName: true,
    },
  },
  reviews: { select: { rating: true } },
} as const;

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findIds(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      select: { listingId: true },
      orderBy: { createdAt: 'desc' },
    });

    return { ids: items.map((item) => item.listingId) };
  }

  async findAll(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: { include: listingInclude },
      },
    });

    return items.map((item) => mapListingCard(item.listing));
  }

  async add(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    try {
      await this.prisma.wishlistItem.create({
        data: { userId, listingId },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Listing already in wishlist');
      }
      throw error;
    }

    return { success: true };
  }

  async remove(userId: string, listingId: string) {
    const result = await this.prisma.wishlistItem.deleteMany({
      where: { userId, listingId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Listing not in wishlist');
    }

    return { success: true };
  }
}
