import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReservationStatus, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import {
  mapListingCard,
  mapListingDetail,
  slugify,
} from './listings.mapper';

const userSelect = {
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
} as const;

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryListingsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {};

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    if (query.boatType) {
      where.boatType = { equals: query.boatType, mode: 'insensitive' };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    if (query.minGuests !== undefined) {
      where.boatGuests = { gte: query.minGuests };
    }

    if (query.hasCaptain !== undefined) {
      where.hasCaptain = query.hasCaptain;
    }

    if (query.excludeSlug) {
      where.slug = { not: query.excludeSlug };
    }

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: userSelect },
          reviews: { select: { rating: true } },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data: listings.map(mapListingCard),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { slug },
      include: {
        user: { select: userSelect },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return mapListingDetail(listing);
  }

  async getBookedDates(slug: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const reservations = await this.prisma.reservation.findMany({
      where: {
        listingId: listing.id,
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
        },
        checkOut: { gte: new Date() },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
      orderBy: { checkIn: 'asc' },
    });

    return reservations.map((reservation) => ({
      checkIn: reservation.checkIn.toISOString(),
      checkOut: reservation.checkOut.toISOString(),
    }));
  }

  async findMine(userId: string) {
    const listings = await this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: userSelect },
        reviews: { select: { rating: true } },
      },
    });

    return listings.map(mapListingCard);
  }

  async create(userId: string, dto: CreateListingDto) {
    await this.ensureHostCanPublish(userId);

    const slug = await this.resolveUniqueSlug(dto.slug ?? dto.title);

    const listing = await this.prisma.listing.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        price: dto.price,
        location: dto.location,
        lat: dto.lat,
        lng: dto.lng,
        images: dto.images ?? [],
        boatName: dto.boatName,
        boatGuests: dto.boatGuests,
        boatCabins: dto.boatCabins,
        boatBathrooms: dto.boatBathrooms,
        duration: dto.duration,
        hasCaptain: dto.hasCaptain ?? false,
        equipment: dto.equipment as Prisma.InputJsonValue,
        specifications: dto.specifications as Prisma.InputJsonValue,
        boatType: dto.boatType,
        userId,
      },
      include: {
        user: { select: userSelect },
        reviews: { select: { rating: true } },
      },
    });

    return mapListingCard(listing);
  }

  async update(
    id: string,
    userId: string,
    role: UserRole,
    dto: UpdateListingDto,
  ) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own listings');
    }

    let slug = dto.slug;

    if (dto.title && !slug) {
      slug = await this.resolveUniqueSlug(dto.title, id);
    } else if (slug) {
      slug = await this.resolveUniqueSlug(slug, id);
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        price: dto.price,
        location: dto.location,
        lat: dto.lat,
        lng: dto.lng,
        images: dto.images,
        boatName: dto.boatName,
        boatGuests: dto.boatGuests,
        boatCabins: dto.boatCabins,
        boatBathrooms: dto.boatBathrooms,
        duration: dto.duration,
        hasCaptain: dto.hasCaptain,
        equipment: dto.equipment as Prisma.InputJsonValue,
        specifications: dto.specifications as Prisma.InputJsonValue,
        boatType: dto.boatType,
      },
      include: {
        user: { select: userSelect },
        reviews: { select: { rating: true } },
      },
    });

    return mapListingCard(updated);
  }

  async remove(id: string, userId: string, role: UserRole) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.prisma.listing.delete({ where: { id } });

    return { success: true };
  }

  private async ensureHostCanPublish(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        plan: true,
        _count: { select: { listingsAsOwner: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.GUEST) {
      const litePlan = await this.prisma.plan.findFirst({
        where: { name: 'Lite' },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          role: UserRole.HOST,
          planId: litePlan?.id ?? user.planId,
        },
      });

      return;
    }

    if (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not allowed to publish listings');
    }

    if (
      user.plan &&
      user.plan.maxListings !== -1 &&
      user._count.listingsAsOwner >= user.plan.maxListings
    ) {
      throw new BadRequestException('Listing limit reached for your plan');
    }
  }

  private async resolveUniqueSlug(base: string, excludeId?: string) {
    const normalized = slugify(base);

    if (!normalized) {
      throw new ForbiddenException('Invalid slug');
    }

    let candidate = normalized;
    let suffix = 2;

    while (true) {
      const existing = await this.prisma.listing.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!existing || existing.id === excludeId) {
        return candidate;
      }

      candidate = `${normalized}-${suffix}`;
      suffix += 1;
    }
  }
}
