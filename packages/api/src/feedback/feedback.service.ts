import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateHostInquiryInput,
  CreateListingReportInput,
} from '@seanb/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async createInquiry(
    slug: string,
    dto: CreateHostInquiryInput,
    userId?: string | null,
  ) {
    const listing = await this.prisma.listing.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    await this.prisma.hostInquiry.create({
      data: {
        listingId: listing.id,
        userId: userId ?? null,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        message: dto.message,
      },
    });

    return { success: true };
  }

  async createReport(
    slug: string,
    dto: CreateListingReportInput,
    userId?: string | null,
  ) {
    const listing = await this.prisma.listing.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    await this.prisma.listingReport.create({
      data: {
        listingId: listing.id,
        userId: userId ?? null,
        reason: dto.reason,
        email: dto.email,
        message: dto.message,
      },
    });

    return { success: true };
  }
}
