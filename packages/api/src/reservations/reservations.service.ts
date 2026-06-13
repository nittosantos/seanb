import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationInput,
  UpdateReservationInput,
} from '@seanb/shared';
import {
  mapGuestTrip,
  mapHostReservationRow,
  mapReservationDetail,
  nightsBetween,
  toNumber,
} from './reservations.mapper';

const reservationInclude = {
  listing: {
    select: {
      id: true,
      slug: true,
      title: true,
      images: true,
      duration: true,
      price: true,
      userId: true,
    },
  },
  guest: {
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
    },
  },
} as const;

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(guestId: string, dto: CreateReservationInput) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new BadRequestException('Invalid dates');
    }

    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
      throw new BadRequestException('Check-in cannot be in the past');
    }

    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId === guestId) {
      throw new BadRequestException('You cannot book your own listing');
    }

    const overlap = await this.prisma.reservation.findFirst({
      where: {
        listingId: listing.id,
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
        },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn },
      },
    });

    if (overlap) {
      throw new BadRequestException('Selected dates are not available');
    }

    const nights = nightsBetween(checkIn, checkOut);
    const nightlyPrice = toNumber(listing.price);
    const totalPrice = nightlyPrice * nights;

    const reservation = await this.prisma.reservation.create({
      data: {
        listingId: listing.id,
        guestId,
        checkIn,
        checkOut,
        totalPrice,
        status: ReservationStatus.PENDING,
      },
      include: reservationInclude,
    });

    return mapReservationDetail(reservation);
  }

  async findMineAsGuest(guestId: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: { guestId },
      orderBy: { checkIn: 'desc' },
      include: reservationInclude,
    });

    return reservations.map(mapGuestTrip);
  }

  async findMineAsHost(hostId: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        listing: { userId: hostId },
      },
      orderBy: { createdAt: 'desc' },
      include: reservationInclude,
    });

    return reservations.map(mapHostReservationRow);
  }

  async updateStatus(
    id: string,
    userId: string,
    role: UserRole,
    dto: UpdateReservationInput,
  ) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: reservationInclude,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const isGuest = reservation.guestId === userId;
    const isHost = reservation.listing.userId === userId;
    const isAdmin = role === UserRole.ADMIN;

    if (!isGuest && !isHost && !isAdmin) {
      throw new ForbiddenException('Not allowed to update this reservation');
    }

    this.assertStatusTransition(
      reservation.status,
      dto.status,
      isGuest,
      isHost || isAdmin,
    );

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: { status: dto.status },
      include: reservationInclude,
    });

    return mapReservationDetail(updated);
  }

  private assertStatusTransition(
    current: ReservationStatus,
    next: ReservationStatus,
    isGuest: boolean,
    isHostOrAdmin: boolean,
  ) {
    if (current === next) {
      throw new BadRequestException('Reservation already has this status');
    }

    if (next === ReservationStatus.CANCELLED) {
      if (!isGuest && !isHostOrAdmin) {
        throw new ForbiddenException('Not allowed to cancel');
      }
      if (
        current !== ReservationStatus.PENDING &&
        current !== ReservationStatus.CONFIRMED
      ) {
        throw new BadRequestException('Cannot cancel this reservation');
      }
      return;
    }

    if (next === ReservationStatus.CONFIRMED) {
      if (!isHostOrAdmin) {
        throw new ForbiddenException('Only the host can confirm');
      }
      if (current !== ReservationStatus.PENDING) {
        throw new BadRequestException('Only pending reservations can be confirmed');
      }
      return;
    }

    if (next === ReservationStatus.COMPLETED) {
      if (!isHostOrAdmin) {
        throw new ForbiddenException('Only the host can complete');
      }
      if (current !== ReservationStatus.CONFIRMED) {
        throw new BadRequestException('Only confirmed reservations can be completed');
      }
      return;
    }

    throw new BadRequestException('Invalid status transition');
  }
}
